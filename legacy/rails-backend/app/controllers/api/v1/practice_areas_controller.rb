module Api
  module V1
    class PracticeAreasController < ApplicationController
      before_action :set_practice_area, only: [:show]

      # GET /api/v1/practice_areas
      def index
        @practice_areas = PracticeArea.all
        render json: @practice_areas
      end

      # GET /api/v1/practice_areas/1
      def show
        render json: @practice_area
      end

      private

      def set_practice_area
        @practice_area = PracticeArea.find(params[:id])
      end
    end
  end
end
