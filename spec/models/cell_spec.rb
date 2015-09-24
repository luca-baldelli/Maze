require 'spec_helper'

describe Cell do
  describe '#initialize' do
    it 'defaults config to be surrounded by walls' do
      expect(subject.config).to(eq(up: :unvisited, down: :unvisited, left: :unvisited, right: :unvisited))
    end
  end
end