import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

FEATURES = [
    'Age', 'Gender', 'Weight (kg)', 'BMI', 'Steps_Taken',
    'Calories_Burned', 'Active_Minutes', 'Heart_Rate (bpm)',
    'Stress_Level (1-10)', 'Activity_Ratio'
]

MODEL_PATH = "water_model.pkl"


def train_and_save_model(csv_path: str):
    df = pd.read_csv(csv_path, low_memory=False)

    numeric_cols = ['Weight (kg)', 'Height (cm)', 'Calories_Burned', 'Active_Minutes',
                    'Heart_Rate (bpm)', 'Steps_Taken', 'Hours_Slept', 'Stress_Level (1-10)']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df = df.copy()
    df['Height_m'] = df['Height (cm)'] / 100
    df['BMI'] = df['Weight (kg)'] / (df['Height_m'] ** 2)
    df['Activity_Ratio'] = df['Active_Minutes'] / (df['Hours_Slept'] + 1)
    df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})

    target = 'Water_Intake (Liters)'
    for col in FEATURES + [target]:
        lower = df[col].quantile(0.01)
        upper = df[col].quantile(0.99)
        df = df[(df[col] >= lower) & (df[col] <= upper)]

    X = df[FEATURES]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = make_pipeline(
        StandardScaler(),
        GradientBoostingRegressor(
            n_estimators=300,
            learning_rate=0.1,
            max_depth=7,
            min_samples_split=5,
            random_state=42,
            loss='huber'
        )
    )

    model.fit(X_train, y_train)
    joblib.dump(model, MODEL_PATH)

    y_pred = model.predict(X_test)
    print("\nModel Performance:")
    print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f} L")
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f} L")

    importance = model.named_steps['gradientboostingregressor'].feature_importances_
    print("\nFeature Importance:")
    for feat, imp in sorted(zip(FEATURES, importance), key=lambda x: -x[1]):
        print(f"{feat}: {imp:.3f}")


def recommend_water_intake(user_data: dict):
    model = joblib.load(MODEL_PATH)

    bmi = user_data['Weight_kg'] / ((user_data['Height_cm'] / 100) ** 2)
    activity_ratio = user_data['Active_Minutes'] / (user_data['Hours_Slept'] + 1)

    input_df = pd.DataFrame([{
        'Age': user_data['Age'],
        'Gender': user_data['Gender'],
        'Weight (kg)': user_data['Weight_kg'],
        'BMI': bmi,
        'Steps_Taken': user_data['Steps_Taken'],
        'Calories_Burned': user_data['Calories_Burned'],
        'Active_Minutes': user_data['Active_Minutes'],
        'Heart_Rate (bpm)': user_data['Heart_Rate'],
        'Stress_Level (1-10)': user_data['Stress_Level'],
        'Activity_Ratio': activity_ratio
    }])

    input_df = input_df[FEATURES]
    prediction = model.predict(input_df)[0]

    min_water = max(1.0, user_data['Weight_kg'] * 0.03)
    max_water = min(7.0, user_data['Weight_kg'] * 0.06)

    return round(np.clip(prediction, min_water, max_water), 1)


# Optional: example usage
if __name__ == "__main__":
    # Uncomment to train the model (only needed once)
    train_and_save_model("fitness_tracking.csv")

    user_profile = {
        'Age': 30,
        'Gender': 1,  # 1 for male, 0 for female
        'Weight_kg': 70,
        'Height_cm': 175,
        'Steps_Taken': 10000,
        'Calories_Burned': 500,
        'Active_Minutes': 60,
        'Heart_Rate': 75,
        'Stress_Level': 4,
        'Hours_Slept': 7
    }

    print("\nRecommended Water Intake:", recommend_water_intake(user_profile), "L")
