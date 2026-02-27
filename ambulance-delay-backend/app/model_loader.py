import joblib
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "delay_predictor_rf_v1.pkl"
)

model = joblib.load(MODEL_PATH)
