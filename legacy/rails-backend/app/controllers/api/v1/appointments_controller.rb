module Api
  module V1
    class AppointmentsController < ApplicationController
      # POST /api/v1/appointments
      def create
        @appointment = Appointment.new(appointment_params)

        if @appointment.save
          # Send confirmation email - to be implemented
          render json: { message: 'Appointment scheduled successfully', appointment: @appointment }, status: :created
        else
          render json: { errors: @appointment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def appointment_params
        params.require(:appointment).permit(:name, :email, :phone, :date, :time, :attorney_id, :practice_area, :description)
      end
    end
  end
end
