describe('PathFinder', function () {
    var pathFinder,
        maze;

    beforeEach(function () {
        maze = MazeMock();
        pathFinder = new PathFinder(maze);
        pathFinder.findPath();
    });

    describe('solution', function () {
        it('should start from the top left corner', function () {
            expect(maze[0][0].solution).toBe(true);
        });

        it('should end at the bottom right corner', function () {
            expect(maze[maze.length-1][maze.length-1].solution).toBe(true);
        });
    });
});