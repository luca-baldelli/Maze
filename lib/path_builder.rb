class PathBuilder
  OPPOSITE = {
      up: :down,
      down: :up,
      left: :right,
      right: :left
  }

  attr_reader :cells, :path

  def initialize maze
    @maze = maze
    @cells = maze.cells
    @path = [@cells[0, 0]]
  end

  def build
    begin
      if random_direction=random_direction()
        current_cell.set_open(random_direction)
        move(random_direction)
        set_walls
        current_cell.set_open(OPPOSITE[random_direction])
      else
        last_fork = @path.reverse.find { |cell| cell.unvisited.any? }
        if last_fork
          slice_from(last_fork)
        else
          random_cell = @path.sample
          random_cell.set(unvisited: [:up, :down, :left, :right])
          slice_from(random_cell)
        end
      end
    end while @cells.collect(&:unvisited).to_a.flatten.size > 0
  end

  private

  def exit_cell
    @cells[@maze.size-1, @maze.size-1]
  end

  def slice_from(cell)
    @path.slice!(@path.index(cell)+1..-1)
  end

  def move(random_direction)
    @path << neighbours[random_direction]
  end

  def set_walls
    neighbours.each do |direction, neighbour|
      if @path[0..-3].include?(neighbour)
        current_cell.set_wall(direction)
        neighbour.set_wall(OPPOSITE[direction])
      end
    end
  end

  def neighbours
    @maze.neighbours_of(current_cell)
  end

  def random_direction
    current_cell.unvisited.sample
  end

  def current_cell
    @path.last
  end
end