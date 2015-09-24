require 'matrix'

class Maze
  attr_reader :cells, :size

  def initialize(size: 10, path_builder: PathBuilder)
    raw_matrix = Array.new(size) { Array.new(size) { Cell.new } }
    @cells = Matrix[*raw_matrix]
    @size = size

    @cells[0, 0].start = true
    @cells[size-1, size-1].end = true
    setup_boundaries
    path_builder.new(self).build
  end

  def neighbours_of(cell)
    cell_index = @cells.index(cell)
    {
        left: @cells[cell_index[0]-1,cell_index[1]],
        right: @cells[cell_index[0]+1,cell_index[1]],
        up: @cells[cell_index[0],cell_index[1]-1],
        down: @cells[cell_index[0],cell_index[1]+1]
    }
  end

  def as_json *args
    @cells.map do |cell|
      cell.to_hash
    end.as_json *args
  end

  private

  def setup_boundaries
    @cells[0, 0].set(wall: [:up, :left])
    @cells[size-1, size-1].set(wall: [:down, :right])
    @cells[size-1, 0].set(wall: [:up, :right])
    @cells[0, size-1].set(wall: [:down, :left])


    @cells.minor(1..size-2, 0..0).each do |cell|
      cell.set(wall: [:up])
    end

    @cells.minor(1..size-2, size-1..size-1).each do |cell|
      cell.set(wall: [:down])
    end

    @cells.minor(0..0, 1..size-2).each do |cell|
      cell.set(wall: [:left])
    end

    @cells.minor(size-1..size-1, 1..size-2).each do |cell|
      cell.set(wall: [:right])
    end
  end
end
