var Maze = {
    random: function (size) {
        return m.request({method: "GET", url: "random.json?size=" + size});
    }
};

var PathFinder = {
    isVisited: function (cell, maze) {
        if (cell[0] < 0 || cell[0] >= maze.length || cell[1] < 0 || cell[1] >= maze.length) {
            return true;
        }
        return maze[cell[0]][cell[1]].visited === true;
    },
    neighbour: function (currentRow, currentColumn, direction) {
        var row = currentRow;
        var column = currentColumn;
        if (direction === 'up') {
            column -= 1;
        } else if (direction === 'down') {
            column += 1;
        } else if (direction === 'left') {
            row -= 1;
        } else if (direction === 'right') {
            row += 1;
        }

        return [row, column];
    },
    unexploredDirections: function (directions, currentRow, currentColumn, maze) {
        var unexploredDirections = [];

        for (var i = 0; i < directions.length; i++) {
            if (!PathFinder.isVisited(PathFinder.neighbour(currentRow, currentColumn, directions[i]), maze)) {
                unexploredDirections.push(directions[i]);
            }
        }

        return unexploredDirections;
    },
    randomDirection: function (availableDirections, currentRow, currentColumn, maze) {
        var unexploredDirections = PathFinder.unexploredDirections(availableDirections, currentRow, currentColumn, maze);
        return unexploredDirections[Math.floor(Math.random() * unexploredDirections.length)];
    },
    backToFork: function (path, maze) {
        var i;
        for (i = path.length - 1; i >= 0; i--) {
            if (PathFinder.unexploredDirections(['up', 'down', 'left', 'right'], path[i][0], path[i][1], maze).length > 0) {
                break;
            } else {
                maze[path[i][0]][path[i][1]].solution = false;
            }
        }
        path.slice(0, i + 1);
        return [path[i][0], path[i][1]];
    },
    findPath: function (maze) {
        var currentRow = 0;
        var currentColumn = 0;
        var path = [[currentRow, currentColumn]];
        maze[currentRow][currentColumn].visited = true;
        maze[currentRow][currentColumn].solution = true;
        var deadEnd = false;

        while (!(currentRow === maze.length - 1 && currentColumn === maze.length - 1)) {
            var availableDirections = maze[currentRow][currentColumn].open;
            var randomDirection = PathFinder.randomDirection(availableDirections, currentRow, currentColumn, maze);
            if (randomDirection === 'up') {
                currentColumn -= 1;
                path.push([currentRow, currentColumn]);
                maze[currentRow][currentColumn].visited = true;
                maze[currentRow][currentColumn].solution = true;
            } else if (randomDirection === 'down') {
                currentColumn += 1;
                path.push([currentRow, currentColumn]);
                maze[currentRow][currentColumn].visited = true;
                maze[currentRow][currentColumn].solution = true;
            } else if (randomDirection === 'left') {
                currentRow -= 1;
                path.push([currentRow, currentColumn]);
                maze[currentRow][currentColumn].visited = true;
                maze[currentRow][currentColumn].solution = true;
            } else if (randomDirection === 'right') {
                currentRow += 1;
                path.push([currentRow, currentColumn]);
                maze[currentRow][currentColumn].visited = true;
                maze[currentRow][currentColumn].solution = true;
            } else {
                deadEnd = true;
                var fork = PathFinder.backToFork(path, maze);
                currentRow = fork[0];
                currentColumn = fork[1];
            }
        }
    }
};

var MazeApp = {
    controller: function () {
        var mazeSize = m.prop(20);
        var maze = m.prop(Maze.random(mazeSize()));
        var loading = m.prop(false);
        var pathFound = m.prop(false);

        return {
            maze: maze,
            mazeSize: mazeSize,
            loading: loading,
            pathFound: pathFound,
            generate: function (size) {
                loading(true);
                m.redraw(true);
                Maze.random(size).then(function (response) {
                    maze(response);
                    loading(false);
                    pathFound(false);
                    m.redraw(true);
                });
            },
            findPath: function () {
                PathFinder.findPath(maze());
                pathFound(true);
            }
        }
    },

    //view
    view: function (ctrl) {
        var maze = ctrl.maze;
        var mazeSize = ctrl.mazeSize;
        var loading = ctrl.loading;
        var pathFound = ctrl.pathFound;

        return m("div", [
            m("input", {onchange: m.withAttr("value", mazeSize), value: mazeSize()}),
            m("button", {onclick: ctrl.generate.bind(ctrl, mazeSize())}, "Generate"),
            m("button", {onclick: ctrl.findPath, class: pathFound() ? 'hidden' : ''}, "Find Path"),
            m("span", loading() ? 'loading' : ''),
            m("div.maze", {class: loading() ? 'hidden' : ''}, [
                maze().map(function (column) {
                    return m(".column", [
                        column.map(function (cell) {
                            var wallClasses = cell.wall.join(' ');
                            var solutionClass = cell.solution ? 'solution' : '';
                            var startClass = cell.start ? 'start' : '';
                            var endClass = cell.end ? 'end' : '';
                            return m("div", {
                                class: 'wall ' +
                                wallClasses + ' ' +
                                solutionClass + ' ' +
                                startClass + ' ' +
                                endClass
                            });
                        })
                    ]);
                })
            ])
        ]);
    }
};

m.mount(document.getElementById("maze"), MazeApp);