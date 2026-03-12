module Api
  module V1
    class AttorneysController < ApplicationController
      before_action :set_attorney, only: [:show]

      # GET /api/v1/attorneys
      def index
        @attorneys = Attorney.all
        render json: @attorneys
      end

      # GET /api/v1/attorneys/1
      def show
        render json: @attorney
      end

      private

      def set_attorney
        @attorney = Attorney.find(params[:id])
      end
    end
  end
end
