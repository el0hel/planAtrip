from flask import Flask
from flask_cors import CORS
# import the database instance
from planAtrip.db import db
# importing routes
from planAtrip.routes.user_routes import user_blueprint
from planAtrip.routes.trip_routes import trip_blueprint

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.url_map.strict_slashes = False  # avoid redirect issues

app.config.from_pyfile('config.py')

app.register_blueprint(user_blueprint, url_prefix='/users')
app.register_blueprint(trip_blueprint, url_prefix='/trips')


@app.route('/')
def home():
    return "Welcome to planAtrip, this is a try"


# Manually set debug mode here
app.config['DEBUG'] = True  # Force debug mode on

if __name__ == '__main__':
    app.run(debug=True)
