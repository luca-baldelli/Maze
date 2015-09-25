describe('PathFinder', function () {
    var pathFinder,
        maze,
        pathCoordinatesList;

    beforeEach(function () {
        maze = MazeMock();
        pathFinder = new PathFinder(maze);
        pathFinder.findPath();

        pathCoordinatesList = [];

        for (var i = 0; i < maze.length; i++) {
            for (var j = 0; j < maze.length; j++) {
                if (maze[i][j].solution) {
                    pathCoordinatesList.push([i, j]);
                }
            }
        }
    });

    describe('path', function () {
        it('should start from the top left corner', function () {
            expect(maze[0][0].solution).toBe(true);
        });

        it('should end at the bottom right corner', function () {
            expect(maze[maze.length - 1][maze.length - 1].solution).toBe(true);
        });

        it('should be connected (each path cell has at least one neighbour path cell)', function () {
            var pathCoordinates,
                pathCell,
                neighboursCoordinatesList,
                pathCellNeighbours;

            for (var i = 1; i < maze.length-1; i++) {
                pathCoordinates = pathCoordinatesList[i];
                pathCell = maze[pathCoordinates[0]][pathCoordinates[1]];
                neighboursCoordinatesList = [
                    [pathCoordinates[0] + 1, pathCoordinates[1]],
                    [pathCoordinates[0] - 1, pathCoordinates[1]],
                    [pathCoordinates[0], pathCoordinates[1] + 1],
                    [pathCoordinates[0], pathCoordinates[1] - 1]
                ];

                pathCellNeighbours = [];
                for (var j = 0; j < neighboursCoordinatesList.length; j++) {
                    var neighboursCoordinates = neighboursCoordinatesList[j];
                    if (neighboursCoordinates[0] >= 0 && neighboursCoordinates[0] < maze.length &&
                        neighboursCoordinates[1] >= 0 && neighboursCoordinates[1] < maze.length) {

                        var neighbourCell = maze[neighboursCoordinates[0]][neighboursCoordinates[1]];

                        if (neighbourCell.solution) {
                            pathCellNeighbours.push(neighbourCell);
                        }
                    }


                }

                expect(pathCellNeighbours.length).toBeGreaterThan(1);
            }
        });
    });
});