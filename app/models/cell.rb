class Cell
  attr_accessor :unvisited, :wall, :open

  def initialize
    @unvisited = [:up, :down, :left, :right]
    @wall = []
    @open = []
  end

  def set(unvisited: [], open: [], wall: [])
    unvisited.each { |direction| set_unvisited(direction) }
    open.each { |direction| set_open(direction) }
    wall.each { |direction| set_wall(direction) }
  end

  def set_open direction
    @open << direction
    @wall.delete(direction)
    @unvisited.delete(direction)
  end

  def set_wall direction
    @wall << direction
    @open.delete(direction)
    @unvisited.delete(direction)
  end

  def set_unvisited direction
    @unvisited << direction
    @open.delete(direction)
    @wall.delete(direction)
  end

  def to_hash
    {unvisited: unvisited, open: open, wall: wall}
  end
end