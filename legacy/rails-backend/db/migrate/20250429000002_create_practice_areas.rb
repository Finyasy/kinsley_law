class CreatePracticeAreas < ActiveRecord::Migration[8.0]
  def change
    create_table :practice_areas do |t|
      t.string :name, null: false
      t.text :description, null: false
      t.references :attorney, foreign_key: true

      t.timestamps
    end
  end
end
