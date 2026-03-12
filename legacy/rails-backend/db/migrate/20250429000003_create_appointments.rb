class CreateAppointments < ActiveRecord::Migration[8.0]
  def change
    create_table :appointments do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone, null: false
      t.date :date, null: false
      t.string :time, null: false
      t.string :practice_area, null: false
      t.text :description, null: false
      t.references :attorney, null: false, foreign_key: true

      t.timestamps
    end
  end
end
