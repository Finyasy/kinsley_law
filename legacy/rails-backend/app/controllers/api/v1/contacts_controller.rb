module Api
  module V1
    class ContactsController < ApplicationController
      # POST /api/v1/contacts
      def create
        @contact = Contact.new(contact_params)

        if @contact.save
          # Send email notification - to be implemented
          render json: { message: 'Thank you for contacting us. We will get back to you shortly.' }, status: :created
        else
          render json: { errors: @contact.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def contact_params
        params.require(:contact).permit(:name, :email, :phone, :service, :message)
      end
    end
  end
end
