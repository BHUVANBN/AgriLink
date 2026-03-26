import logging

logger = logging.getLogger("eligibility-engine")

# ── Top 10 Central Government Schemes ───────────────────────
SCHEMES_DB = [
    {
        "id": "pm_kisan",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "benefit": "₹6,000 per annum paid in three installments of ₹2,000 directly into bank accounts.",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "rules": {
            "requiresPosessionOfLand": True,
            "isIncomeTaxPayer": False,
            "isGovtEmployee": False,
            "excludesInstitutionalLandHolders": True
        },
        "description": "Income support to all landholding farmers' families in the country."
    },
    {
        "id": "pmfby",
        "name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
        "benefit": "Financial support to farmers suffering crop loss/damage arising out of natural calamities.",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "rules": {
            "hasLand": True,
            "anyLandSize": True
        },
        "description": "Comprehensive crop insurance scheme protecting against non-preventable natural risks."
    },
    {
        "id": "kcc",
        "name": "KCC (Kisan Credit Card)",
        "benefit": "Available credit for cultivation, post-harvest expenses, and consumption needs at low interest.",
        "ministry": "Various Banks / NABARD",
        "rules": {
            "engagedInFarming": True,
            "includesAlliedActivities": True
        },
        "description": "Provides adequate and timely credit support from the banking system."
    },
    {
        "id": "pm_kusum",
        "name": "PM-KUSUM (Solar Pumps)",
        "benefit": "Subsidies up to 60% for installing solar pumps and solarization of existing grid-connected pumps.",
        "ministry": "Ministry of New and Renewable Energy",
        "rules": {
            "hasLand": True,
            "canInstallSolar": True
        },
        "description": "Aims to ensure energy security for farmers and increase income by selling surplus power."
    },
    {
        "id": "soil_health_card",
        "name": "Soil Health Card Scheme",
        "benefit": "Free soil testing and customized fertilizer recommendations every 2 years.",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "rules": {
            "isFarmer": True
        },
        "description": "Assists State Governments to issue soil health cards to all farmers in the country."
    },
    {
        "id": "pkvy",
        "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
        "benefit": "Financial assistance of ₹50,000 per hectare for 3 years for organic inputs/certification.",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "rules": {
            "farmingType": "ORGANIC",
            "clusterBased": True
        },
        "description": "Promotes organic farming through a cluster-based approach and PGS certification."
    },
    {
        "id": "aif",
        "name": "Agri Infrastructure Fund (AIF)",
        "benefit": "Interest subvention of 3% per annum for loans up to ₹2 Crores for post-harvest infra.",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "rules": {
            "hasInfraNeed": True
        },
        "description": "Financing facility for investment in viable projects for post-harvest management infrastructure."
    },
    {
        "id": "enam",
        "name": "e-NAM (National Agriculture Market)",
        "benefit": "Access to a multi-state online trading portal for better price discovery of produce.",
        "ministry": "SFAC / Ministry of Agriculture",
        "rules": {
            "registeredInMandi": True
        },
        "description": "Pan-India electronic trading portal which networks the existing APMC mandis."
    },
    {
        "id": "smam",
        "name": "SMAM (Sub-Mission on Agricultural Mechanization)",
        "benefit": "40% to 50% subsidy for purchasing tractors, power tillers, and other farm machinery.",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "rules": {
            "landHolding": "Small/Marginal"
        },
        "description": "Aims to reach the unreached by bringing farm mechanization to small and marginal farmers."
    },
    {
        "id": "dairy_entrepreneurship",
        "name": "Dairy Entrepreneurship Development Scheme",
        "benefit": "Capital subsidy (25%-33%) for setting up small dairy farms and milk processing units.",
        "ministry": "DAHD / NABARD",
        "rules": {
            "hasLivestock": True
        },
        "description": "Generates self-employment and provides infrastructure for the dairy sector."
    }
]

def match_schemes(profile: dict) -> list:
    """
    AgriLink Eligibility Engine
    Matches profile against hardcoded rules for the top 10 central schemes.
    """
    matched = []
    
    # Extract profile fields with defaults
    land_acres = float(profile.get("landHoldingAcres") or 0)
    is_tax_payer = bool(profile.get("isIncomeTaxPayer", False))
    is_govt_emp = bool(profile.get("isGovtEmployee", False))
    has_livestock = bool(profile.get("hasLivestock", False))
    farming_type = str(profile.get("farmingType", "CONVENTIONAL")).upper()
    caste = str(profile.get("casteCategory", "GENERAL")).upper()
    
    for scheme in SCHEMES_DB:
        id = scheme["id"]
        reason = ""
        eligible = True

        if id == "pm_kisan":
            if land_acres <= 0:
                eligible = False
                reason = "Requires cultivable land ownership."
            elif is_tax_payer:
                eligible = False
                reason = "Income tax payers are excluded."
            elif is_govt_emp:
                eligible = False
                reason = "Government employees are excluded."
        
        elif id == "pmfby":
            if land_acres <= 0:
                eligible = False
                reason = "Requires active land for insurance."
        
        elif id == "pkvy":
            if farming_type != "ORGANIC":
                eligible = False
                reason = "Exclusive for organic farming clusters."
        
        elif id == "smam":
            if land_acres > 5: # Small/Marginal cutoff (2 hectares approx 5 acres)
                eligible = False
                reason = "Prioritized for small and marginal farmers (< 5 acres)."
        
        elif id == "dairy_entrepreneurship":
            if not has_livestock:
                eligible = False
                reason = "Requires livestock ownership or intent."

        # Add more logic here...
        
        if eligible:
            # Rank score based on completeness of requirements
            score = 100
            if land_acres > 0: score += 10
            
            matched.append({
                "name": scheme["name"],
                "id": scheme["id"],
                "reason": reason or "You meet the primary criteria for this scheme.",
                "benefit": scheme["benefit"],
                "description": scheme["description"],
                "ministry": scheme["ministry"],
                "score": score
            })

    # Sort by score
    matched.sort(key=lambda x: x["score"], reverse=True)
    return matched
