class Contact < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true
  validates :service, presence: true
  validates :message, presence: true
end
