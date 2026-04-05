import pickle
import pandas as pd
import json

movies_dict = pickle.load(open("movie_dict.pkl", "rb"))

# Convert to DataFrame
movies = pd.DataFrame(movies_dict)

# Convert to list of dicts
movies_list = movies.to_dict(orient="records")

# Save JSON
with open("movies.json", "w") as f:
    json.dump(movies_list, f)