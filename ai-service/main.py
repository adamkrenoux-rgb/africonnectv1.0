from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

app = FastAPI(title="AFRICONNECT AI Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class TripPreferences(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: float
    group_size: int
    interests: List[str]
    accommodation_type: str
    activity_level: str

class ListingOptimizationRequest(BaseModel):
    business_name: str
    business_type: str
    location: str
    description: str
    current_pricing: Optional[float] = None

class CampaignProjectionRequest(BaseModel):
    influencer_followers: int
    engagement_rate: float
    content_type: str
    target_region: str
    business_type: str
    campaign_duration: int

class AIService:
    def __init__(self):
        # Mock AI service for development
        self.model = None
        self.load_model()

    def load_model(self):
        """Load the trained ML model for campaign projections"""
        try:
            # In production, load the actual trained model
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
            # For demo purposes, create dummy data
            X_dummy = np.random.rand(100, 5)
            y_dummy = np.random.rand(100)
            self.model.fit(X_dummy, y_dummy)
        except Exception as e:
            print(f"Model loading failed: {e}")
            self.model = None

    def generate_itinerary(self, preferences: TripPreferences) -> Dict[str, Any]:
        """Generate AI-powered itinerary"""
        # Mock itinerary generation
        itinerary = {
            "title": f"Amazing {preferences.destination} Adventure",
            "duration": f"{preferences.start_date} to {preferences.end_date}",
            "total_cost": preferences.budget * 0.9,
            "days": [
                {
                    "day": 1,
                    "date": preferences.start_date,
                    "activities": [
                        {
                            "time": "09:00",
                            "activity": "Arrival and Welcome",
                            "location": "Airport",
                            "duration": "2 hours",
                            "cost": 0
                        },
                        {
                            "time": "14:00",
                            "activity": "City Tour",
                            "location": "Downtown",
                            "duration": "3 hours",
                            "cost": 50
                        }
                    ],
                    "accommodation": {
                        "name": "Luxury Hotel",
                        "type": preferences.accommodation_type,
                        "cost": 150
                    }
                }
            ],
            "recommendations": [
                "Try local cuisine",
                "Visit cultural sites",
                "Take photos for memories"
            ]
        }
        return itinerary

    def optimize_listing(self, request: ListingOptimizationRequest) -> Dict[str, Any]:
        """Optimize business listing with AI"""
        # Mock optimization
        optimized = {
            "title": f"Amazing {request.business_name} Experience",
            "description": f"Discover the beauty of {request.location} with our {request.business_type} services. {request.description}",
            "pricing_suggestions": {
                "low_season": request.current_pricing * 0.8 if request.current_pricing else 100,
                "high_season": request.current_pricing * 1.2 if request.current_pricing else 150,
                "peak_season": request.current_pricing * 1.5 if request.current_pricing else 200
            },
            "hashtags": ["#africonnect", "#travel", "#adventure", f"#{request.location.lower()}"],
            "social_posts": [
                f"Ready for an amazing {request.business_type} experience in {request.location}?",
                f"Book your {request.business_name} adventure today!"
            ],
            "content_ideas": [
                "Behind the scenes content",
                "Customer testimonials",
                "Local culture highlights"
            ]
        }
        return optimized

    def project_campaign(self, request: CampaignProjectionRequest) -> Dict[str, Any]:
        """Project campaign performance using ML"""
        if not self.model:
            # Fallback to rule-based projection
            base_reach = request.influencer_followers * 0.1
            engagement = base_reach * request.engagement_rate
            roi = engagement * 0.05  # 5% conversion rate
            
            return {
                "predicted_reach": int(base_reach),
                "predicted_engagement": int(engagement),
                "predicted_roi": int(roi),
                "fair_price_range": {
                    "min": int(roi * 0.1),
                    "max": int(roi * 0.3)
                },
                "confidence": 0.7
            }
        
        # Use ML model for prediction
        features = np.array([[
            request.influencer_followers,
            request.engagement_rate,
            len(request.content_type),
            len(request.target_region),
            request.campaign_duration
        ]])
        
        prediction = self.model.predict(features)[0]
        
        return {
            "predicted_reach": int(prediction * 1000),
            "predicted_engagement": int(prediction * 100),
            "predicted_roi": int(prediction * 50),
            "fair_price_range": {
                "min": int(prediction * 10),
                "max": int(prediction * 30)
            },
            "confidence": 0.85
        }

# Initialize AI service
ai_service = AIService()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AFRICONNECT AI Service"}

@app.post("/generate-itinerary")
async def generate_itinerary(preferences: TripPreferences):
    try:
        itinerary = ai_service.generate_itinerary(preferences)
        return {"success": True, "itinerary": itinerary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize-listing")
async def optimize_listing(request: ListingOptimizationRequest):
    try:
        optimization = ai_service.optimize_listing(request)
        return {"success": True, "optimization": optimization}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/project-campaign")
async def project_campaign(request: CampaignProjectionRequest):
    try:
        projection = ai_service.project_campaign(request)
        return {"success": True, "projection": projection}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)