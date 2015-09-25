var PathFinder = function (maze) {
    var path = [];

    this.findPath = function () {
        var currentCoordinates = [0, 0];
        this.moveTo(currentCoordinates, path);

        while (!(currentCoordinates[0] === maze.length - 1 && currentCoordinates[1] === maze.length - 1)) {
            var availableDirections = this.cell(currentCoordinates).open;
            var randomDirection = this.randomDirection(currentCoordinates, availableDirections);
            if (randomDirection) {
                var neighbourCoordinates = this.neighbour(currentCoordinates, randomDirection);
                this.moveTo(neighbourCoordinates);
                currentCoordinates = neighbourCoordinates;
            } else {
                currentCoordinates = this.backToFork();
            }
        }
    };
    this.moveTo = function (coordinates) {
        path.push(coordinates);
        this.cell(coordinates).visited = true;
        this.cell(coordinates).solution = true;
    };
    this.cell = function (coordinates) {
        return maze[coordinates[0]][coordinates[1]];
    };
    this.randomDirection = function (coordinates, availableDirections) {
        var unexploredDirections = this.unexploredDirections(availableDirections, coordinates);
        return unexploredDirections[Math.floor(Math.random() * unexploredDirections.length)];
    };
    this.neighbour = function (coordinates, direction) {
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
    };
    this.isVisited = function (coordinates) {
        if (coordinates[0] < 0 || coordinates[0] >= maze.length || coordinates[1] < 0 || coordinates[1] >= maze.length) {
            return true;
        }
        return this.cell(coordinates).visited === true;
    };
    this.unexploredDirections = function (directions, coordinates) {
        var unexploredDirections = [];

        for (var i = 0; i < directions.length; i++) {
            if (!this.isVisited(this.neighbour(coordinates, directions[i]))) {
                unexploredDirections.push(directions[i]);
            }
        }

        return unexploredDirections;
    };
    this.backToFork = function () {
        var i;
        for (i = path.length - 1; i >= 0; i--) {
            if (this.unexploredDirections(['up', 'down', 'left', 'right'], path[i]).length > 0) {
                break;
            } else {
                this.cell(path[i]).solution = false;
            }
        }
        path.slice(0, i + 1);
        return path[i];
    }
};