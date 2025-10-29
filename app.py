from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# ---------- Database setup ----------
def init_db():
    conn = sqlite3.connect('inventory.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            category TEXT,
            quantity INTEGER,
            price REAL,
            location TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# ---------- Routes ----------
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/get_items', methods=['GET'])
def get_items():
    conn = sqlite3.connect('inventory.db')
    c = conn.cursor()
    c.execute("SELECT * FROM inventory")
    items = c.fetchall()
    conn.close()
    return jsonify(items)


@app.route('/add_item', methods=['POST'])
def add_item():
    data = request.get_json()
    conn = sqlite3.connect('inventory.db')
    c = conn.cursor()
    c.execute('INSERT INTO inventory (product_name, category, quantity, price, location) VALUES (?, ?, ?, ?, ?)',
              (data['product_name'], data['category'], data['quantity'], data['price'], data['location']))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})


@app.route('/update_item/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.get_json()
    conn = sqlite3.connect('inventory.db')
    c = conn.cursor()
    c.execute('''
        UPDATE inventory SET product_name=?, category=?, quantity=?, price=?, location=? WHERE id=?
    ''', (data['product_name'], data['category'], data['quantity'], data['price'], data['location'], item_id))
    conn.commit()
    conn.close()
    return jsonify({'status': 'updated'})


@app.route('/delete_item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    conn = sqlite3.connect('inventory.db')
    c = conn.cursor()
    c.execute('DELETE FROM inventory WHERE id=?', (item_id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'deleted'})


if __name__ == '__main__':
    app.run(debug=True)
