require 'spec_helper'
require 'lib/path_builder'
require 'app/models/maze'
require 'app/models/cell'

describe Maze do
  let(:maze) { Maze.new }
  let(:cells) { maze.cells }
  let(:size) { cells.row_count }

  describe '#initialize' do
    context 'generated maze' do
      it 'is surrounded by walls' do
        cells.minor(0..0, 0..size-1).each do |cell|
          expect(cell.wall).to include(:left)
        end

        cells.minor(size-1..size-1, 0..size-1).each do |cell|
          expect(cell.wall).to include(:right)
        end

        cells.minor(0..size-1, 0..0).each do |cell|
          expect(cell.wall).to include(:up)
        end

        cells.minor(0..size-1, size-1..size-1).each do |cell|
          expect(cell.wall).to include(:down)
        end
      end

      it 'does not have unvisited areas' do
        cells.each do |cell|
          expect(cell.unvisited).to be_empty
        end
      end

      it 'is connected' do
        cells.each do |cell|
          expect(cell.open).not_to be_empty
        end
      end
    end
  end
end