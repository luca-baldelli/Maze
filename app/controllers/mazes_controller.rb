class MazesController < ApplicationController
  def random
    respond_to do |format|
      format.html { render :random }
      format.json do
        @maze = Maze.new size: 40
        render json: @maze.to_json
      end
    end
  end
end
