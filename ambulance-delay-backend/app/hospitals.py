import pandas as pd
import os

DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "hospitals_clean.csv"
)

hospitals_df = pd.read_csv(DATA_PATH, sep="\t")

# normalize column names
hospitals_df.columns = hospitals_df.columns.str.strip().str.lower()

# filter emergency-capable hospitals
hospitals_df = hospitals_df[hospitals_df["emergency_available"] == 1]
