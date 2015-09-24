require 'spec_helper'

describe Maze do
  describe '#initialize' do
    subject { described_class.new(size: size, path_builder: path_builder) }
    let(:size) { 20 }
    let(:path_builder) { double('path_builder').as_null_object }

    context 'cells matrix' do
      it 'generate matrix of cells' do
        expect(subject.cells).to all(be_a(Cell))
      end

      it 'has the right number of rows' do
        expect(subject.cells.row_count).to eq(size)
      end

      it 'has the right number of columns' do
        expect(subject.cells.column_count).to eq(size)
      end

      it 'inner cells are all surrounded by unvisited' do
        configurations = subject.cells.minor(1..size-2, 1..size-2).collect(&:config)
        expect(configurations).to all(eq(up: :unvisited, down: :unvisited, left: :unvisited, right: :unvisited))
      end

      context 'borders' do
        it 'have an entrance at the top left' do
          top_left_cell = subject.cells[0, 0]
          expect(top_left_cell.config).to eq(up: :wall, down: :unvisited, left: :open, right: :unvisited)
        end

        it 'have an exit at the bottom right' do
          bottom_right_cell = subject.cells[size-1, size-1]
          expect(bottom_right_cell.config).to eq(up: :unvisited, down: :wall, left: :unvisited, right: :open)
        end

        it 'have walls on the upper side' do
          expect(subject.cells.minor(1..size-2, 0..0).collect(&:config)).to all(eq(up: :wall, down: :unvisited, left: :unvisited, right: :unvisited))
        end

        it 'have walls on the lower side' do
          expect(subject.cells.minor(1..size-2, size-1..size-1).collect(&:config)).to all(eq(up: :unvisited, down: :wall, left: :unvisited, right: :unvisited))
        end

        it 'have walls on the left side' do
          expect(subject.cells.minor(0..0, 1..size-2).collect(&:config)).to all(eq(up: :unvisited, down: :unvisited, left: :wall, right: :unvisited))
        end

        it 'have walls on the right side' do
          expect(subject.cells.minor(size-1..size-1, 1..size-2).collect(&:config)).to all(eq(up: :unvisited, down: :unvisited, left: :unvisited, right: :wall))
        end
      end
    end

    it 'stores the size' do
      expect(subject.size).to eq(size)
    end
  end
end