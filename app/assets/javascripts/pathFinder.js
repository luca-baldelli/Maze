var PathFinder = {
    findPath: function (maze) {
        var currentCoordinates = [0, 0];
        var path = [];
        PathFinder.moveTo(currentCoordinates, maze, path);

        while (!(currentCoordinates[0] === maze.length - 1 && currentCoordinates[1] === maze.length - 1)) {
            var availableDirections = PathFinder.cell(maze, currentCoordinates).open;
            var randomDirection = PathFinder.randomDirection(currentCoordinates, availableDirections, maze);
            if (randomDirection) {
                var neighbourCoordinates = PathFinder.neighbour(currentCoordinates, randomDirection);
                PathFinder.moveTo(neighbourCoordinates, maze, path);
                currentCoordinates = neighbourCoordinates;
            } else {
                currentCoordinates = PathFinder.backToFork(path, maze);
            }
        }
    },
    moveTo: function (coordinates, maze, path) {
        path.push(coordinates);
        PathFinder.cell(maze, coordinates).visited = true;
        PathFinder.cell(maze, coordinates).solution = true;
    },
    cell: function (maze, coordinates) {
        return maze[coordinates[0]][coordinates[1]];
    },
    randomDirection: function (coordinates, availableDirections, maze) {
        var unexploredDirections = PathFinder.unexploredDirections(availableDirections, coordinates, maze);
        return unexploredDirections[Math.floor(Math.random() * unexploredDirections.length)];
    },
    neighbour: function (coordinates, direction) {
        var row = coordinates[0];
        var column = coordinates[1];
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
    isVisited: function (coordinates, maze) {
        if (coordinates[0] < 0 || coordinates[0] >= maze.length || coordinates[1] < 0 || coordinates[1] >= maze.length) {
            return true;
        }
        return PathFinder.cell(maze, coordinates).visited === true;
    },
    unexploredDirections: function (directions, coordinates, maze) {
        var unexploredDirections = [];

        for (var i = 0; i < directions.length; i++) {
            if (!PathFinder.isVisited(PathFinder.neighbour(coordinates, directions[i]), maze)) {
                unexploredDirections.push(directions[i]);
            }
        }

        return unexploredDirections;
    },
    backToFork: function (path, maze) {
        var i;
        for (i = path.length - 1; i >= 0; i--) {
            if (PathFinder.unexploredDirections(['up', 'down', 'left', 'right'], path[i], maze).length > 0) {
                break;
            } else {
                PathFinder.cell(maze, path[i]).solution = false;
            }
        }
        path.slice(0, i + 1);
        return path[i];
    }
};