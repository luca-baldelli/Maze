var Maze = {
    random: function (size) {
        return m.request({method: "GET", url: "random.json?size=" + size});
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
                new PathFinder(maze()).findPath();
                pathFound(true);
            }
        }
    },
    view: function (ctrl) {
        var maze = ctrl.maze;
        var mazeSize = ctrl.mazeSize;
        var loading = ctrl.loading;
        var pathFound = ctrl.pathFound;

        return m("div", [
            m("input", {onchange: m.withAttr("value", mazeSize), value: mazeSize()}),
            m("button", {onclick: ctrl.generate.bind(ctrl, mazeSize())}, "Generate"),
            m("button", {onclick: ctrl.findPath, className: pathFound() ? 'hidden' : ''}, "Find Path"),
            m("span", loading() ? 'loading' : ''),
            m("div.maze", {className: loading() ? 'hidden' : ''}, [
                maze().map(function (column) {
                    return m(".column", [
                        column.map(function (cell) {
                            var wallClasses = cell.wall.join(' ');
                            var solutionClass = cell.solution ? 'solution' : '';
                            var startClass = cell.start ? 'start' : '';
                            var endClass = cell.end ? 'end' : '';
                            return m("div", {
                                className: 'wall ' +
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