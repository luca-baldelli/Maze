class MazesController < ApplicationController
  def random
    respond_to do |format|
      format.html { render :random }
      format.json do
        @maze = Maze.new size: size
        render json: @maze.to_json
      end
    end
  end

  def size
    params.require(:size).to_i
  end
end
