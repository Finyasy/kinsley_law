class PracticeArea < ApplicationRecord
  belongs_to :attorney, optional: true
  
  validates :name, presence: true
  validates :description, presence: true
end
