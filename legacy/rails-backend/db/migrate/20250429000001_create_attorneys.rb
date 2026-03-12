class CreateAttorneys < ActiveRecord::Migration[8.0]
  def change
    create_table :attorneys do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone, null: false
      t.text :bio, null: false
      t.string :position
      t.string :specialization

      t.timestamps
    end
    add_index :attorneys, :email, unique: true
  end
end
