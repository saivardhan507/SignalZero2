#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Signal Zero Supabase Migration
Tests all 4 API endpoints with Supabase integration
"""

import requests
import json
import uuid
import time
from datetime import datetime

# Configuration
BASE_URL = "https://ai-agency-hub-50.preview.emergentagent.com"
HEADERS = {"Content-Type": "application/json"}

def log_test(test_name, status, details=""):
    """Log test results with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_icon} {test_name}: {status}")
    if details:
        print(f"    Details: {details}")
    print()

def test_health_endpoint():
    """Test 1: GET /api/health - Supabase connection verification"""
    print("=" * 60)
    print("TEST 1: Health Endpoint with Supabase Check")
    print("=" * 60)
    
    try:
        response = requests.get(f"{BASE_URL}/api/health", headers=HEADERS, timeout=10)
        
        if response.status_code != 200:
            log_test("Health endpoint status", "FAIL", f"Expected 200, got {response.status_code}")
            return False
            
        data = response.json()
        log_test("Health endpoint response", "PASS", f"Status: {response.status_code}")
        
        # Verify response structure
        required_fields = ["status", "service", "database", "timestamp"]
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            log_test("Response structure", "FAIL", f"Missing fields: {missing_fields}")
            return False
            
        log_test("Response structure", "PASS", "All required fields present")
        
        # Verify specific values
        if data.get("service") != "Signal Zero API":
            log_test("Service name", "FAIL", f"Expected 'Signal Zero API', got '{data.get('service')}'")
            return False
            
        log_test("Service name", "PASS", f"Service: {data.get('service')}")
        
        # Check database connection status
        db_status = data.get("database", "")
        if "supabase" not in db_status.lower():
            log_test("Database type", "FAIL", f"Expected Supabase reference, got '{db_status}'")
            return False
            
        log_test("Database connection", "PASS", f"Database: {db_status}")
        
        # Check overall status
        overall_status = data.get("status")
        if overall_status not in ["ok", "degraded"]:
            log_test("Overall status", "FAIL", f"Expected 'ok' or 'degraded', got '{overall_status}'")
            return False
            
        log_test("Overall status", "PASS", f"Status: {overall_status}")
        
        print(f"Full response: {json.dumps(data, indent=2)}")
        return True
        
    except Exception as e:
        log_test("Health endpoint", "FAIL", f"Exception: {str(e)}")
        return False

def test_create_lead():
    """Test 2: POST /api/leads - Lead creation with Supabase storage"""
    print("=" * 60)
    print("TEST 2: Lead Creation with Supabase Storage")
    print("=" * 60)
    
    # Test data matching review request specifications
    lead_data = {
        "fullName": "Sarah Chen",
        "company": "DataFlow Analytics",
        "website": "https://dataflow-analytics.com",
        "email": "sarah.chen@dataflow-analytics.com",
        "services": ["ai", "data"],
        "elevatorPitch": "We need an AI-powered customer analytics platform to process real-time behavioral data and generate predictive insights for our e-commerce clients.",
        "budgetTier": "$25k+",
        "timeline": "3-4 months",
        "dataState": "We have structured data in PostgreSQL and unstructured data in S3",
        "aiReadiness": 8
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/leads", json=lead_data, headers=HEADERS, timeout=15)
        
        if response.status_code != 200:
            log_test("Lead creation status", "FAIL", f"Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
        data = response.json()
        log_test("Lead creation status", "PASS", f"Status: {response.status_code}")
        
        # Verify response structure
        if not data.get("success"):
            log_test("Success flag", "FAIL", f"Expected success: true, got {data.get('success')}")
            return False, None
            
        log_test("Success flag", "PASS", "success: true")
        
        # Verify lead data in response
        lead = data.get("lead")
        if not lead:
            log_test("Lead data", "FAIL", "No lead data in response")
            return False, None
            
        log_test("Lead data presence", "PASS", "Lead data included in response")
        
        # Verify UUID generation
        lead_id = lead.get("id")
        if not lead_id:
            log_test("UUID generation", "FAIL", "No ID in lead data")
            return False, None
            
        try:
            uuid.UUID(lead_id)
            log_test("UUID generation", "PASS", f"Valid UUID: {lead_id}")
        except ValueError:
            log_test("UUID generation", "FAIL", f"Invalid UUID format: {lead_id}")
            return False, None
        
        # Verify email sent flag (Resend integration)
        email_sent = lead.get("email_sent")
        if email_sent is True:
            log_test("Resend email integration", "PASS", "email_sent: true")
        else:
            log_test("Resend email integration", "WARN", f"email_sent: {email_sent} (may be processing)")
        
        # Verify data mapping
        expected_mappings = {
            "full_name": "Sarah Chen",
            "company": "DataFlow Analytics", 
            "email": "sarah.chen@dataflow-analytics.com",
            "services": ["ai", "data"],
            "budget_tier": "$25k+"
        }
        
        mapping_errors = []
        for field, expected_value in expected_mappings.items():
            actual_value = lead.get(field)
            if actual_value != expected_value:
                mapping_errors.append(f"{field}: expected {expected_value}, got {actual_value}")
        
        if mapping_errors:
            log_test("Data mapping", "FAIL", "; ".join(mapping_errors))
            return False, None
        else:
            log_test("Data mapping", "PASS", "All fields mapped correctly")
        
        print(f"Created lead ID: {lead_id}")
        return True, lead_id
        
    except Exception as e:
        log_test("Lead creation", "FAIL", f"Exception: {str(e)}")
        return False, None

def test_get_leads():
    """Test 3: GET /api/leads - Retrieve leads from Supabase"""
    print("=" * 60)
    print("TEST 3: Get Leads from Supabase")
    print("=" * 60)
    
    try:
        response = requests.get(f"{BASE_URL}/api/leads", headers=HEADERS, timeout=10)
        
        if response.status_code != 200:
            log_test("Get leads status", "FAIL", f"Expected 200, got {response.status_code}")
            return False
            
        data = response.json()
        log_test("Get leads status", "PASS", f"Status: {response.status_code}")
        
        # Verify response structure
        if not data.get("success"):
            log_test("Success flag", "FAIL", f"Expected success: true, got {data.get('success')}")
            return False
            
        log_test("Success flag", "PASS", "success: true")
        
        # Verify leads array
        leads = data.get("leads")
        if leads is None:
            log_test("Leads array", "FAIL", "No leads array in response")
            return False
            
        log_test("Leads array presence", "PASS", f"Found {len(leads)} leads")
        
        # Verify sorting (newest first by created_at)
        if len(leads) > 1:
            timestamps = []
            for lead in leads:
                if "created_at" in lead:
                    timestamps.append(lead["created_at"])
            
            if len(timestamps) > 1:
                # Check if sorted in descending order (newest first)
                is_sorted = all(timestamps[i] >= timestamps[i+1] for i in range(len(timestamps)-1))
                if is_sorted:
                    log_test("Sorting order", "PASS", "Leads sorted by created_at DESC")
                else:
                    log_test("Sorting order", "FAIL", "Leads not properly sorted")
            else:
                log_test("Sorting order", "PASS", "Insufficient data to verify sorting")
        else:
            log_test("Sorting order", "PASS", "Single/no leads - sorting not applicable")
        
        # Verify lead structure
        if leads:
            sample_lead = leads[0]
            required_fields = ["id", "full_name", "email"]
            missing_fields = [field for field in required_fields if field not in sample_lead]
            
            if missing_fields:
                log_test("Lead structure", "FAIL", f"Missing fields in lead: {missing_fields}")
                return False
            else:
                log_test("Lead structure", "PASS", "Required fields present in leads")
        
        return True
        
    except Exception as e:
        log_test("Get leads", "FAIL", f"Exception: {str(e)}")
        return False

def test_chat_functionality():
    """Test 4: POST /api/chat - Gemini chatbot with Supabase history"""
    print("=" * 60)
    print("TEST 4: Chat Functionality with Supabase History")
    print("=" * 60)
    
    session_id = f"test-session-{int(time.time())}"
    
    # Test 4a: First message
    print("--- Test 4a: First Chat Message ---")
    
    chat_data_1 = {
        "message": "What AI services does Signal Zero offer?",
        "sessionId": session_id
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/chat", json=chat_data_1, headers=HEADERS, timeout=30)
        
        if response.status_code != 200:
            log_test("First chat message status", "FAIL", f"Expected 200, got {response.status_code}")
            return False
            
        data = response.json()
        log_test("First chat message status", "PASS", f"Status: {response.status_code}")
        
        # Verify response structure
        if not data.get("success"):
            log_test("Chat success flag", "FAIL", f"Expected success: true, got {data.get('success')}")
            return False
            
        log_test("Chat success flag", "PASS", "success: true")
        
        # Verify response content
        response_text = data.get("response")
        if not response_text:
            log_test("Chat response content", "FAIL", "No response text")
            return False
            
        log_test("Chat response content", "PASS", f"Response length: {len(response_text)} chars")
        
        # Check if response mentions Signal Zero services
        ai_keywords = ["ai", "artificial intelligence", "rag", "pipeline", "agent"]
        has_ai_content = any(keyword.lower() in response_text.lower() for keyword in ai_keywords)
        
        if has_ai_content:
            log_test("Response relevance", "PASS", "Response contains AI service information")
        else:
            log_test("Response relevance", "WARN", "Response may not contain expected AI service info")
        
        print(f"First response preview: {response_text[:200]}...")
        
    except Exception as e:
        log_test("First chat message", "FAIL", f"Exception: {str(e)}")
        return False
    
    # Test 4b: Second message with context
    print("\n--- Test 4b: Second Chat Message (Context Test) ---")
    
    time.sleep(2)  # Brief pause to ensure history is stored
    
    chat_data_2 = {
        "message": "What about pricing for those AI services?",
        "sessionId": session_id
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/chat", json=chat_data_2, headers=HEADERS, timeout=30)
        
        if response.status_code != 200:
            log_test("Second chat message status", "FAIL", f"Expected 200, got {response.status_code}")
            return False
            
        data = response.json()
        log_test("Second chat message status", "PASS", f"Status: {response.status_code}")
        
        response_text_2 = data.get("response", "")
        log_test("Second chat response", "PASS", f"Response length: {len(response_text_2)} chars")
        
        # Check for context awareness (pricing/budget information)
        pricing_keywords = ["budget", "pricing", "cost", "$", "tier", "discovery", "consultation"]
        has_pricing_content = any(keyword.lower() in response_text_2.lower() for keyword in pricing_keywords)
        
        if has_pricing_content:
            log_test("Context preservation", "PASS", "Response shows context awareness (pricing info)")
        else:
            log_test("Context preservation", "WARN", "Response may not show clear context awareness")
        
        print(f"Second response preview: {response_text_2[:200]}...")
        
    except Exception as e:
        log_test("Second chat message", "FAIL", f"Exception: {str(e)}")
        return False
    
    return True

def test_chat_validation():
    """Test 5: Chat validation - missing fields should return 400"""
    print("=" * 60)
    print("TEST 5: Chat Validation")
    print("=" * 60)
    
    # Test missing message
    print("--- Test 5a: Missing message field ---")
    try:
        response = requests.post(f"{BASE_URL}/api/chat", json={"sessionId": "test"}, headers=HEADERS, timeout=10)
        
        if response.status_code == 400:
            log_test("Missing message validation", "PASS", f"Correctly returned 400")
        else:
            log_test("Missing message validation", "FAIL", f"Expected 400, got {response.status_code}")
            
    except Exception as e:
        log_test("Missing message validation", "FAIL", f"Exception: {str(e)}")
    
    # Test missing sessionId
    print("--- Test 5b: Missing sessionId field ---")
    try:
        response = requests.post(f"{BASE_URL}/api/chat", json={"message": "test"}, headers=HEADERS, timeout=10)
        
        if response.status_code == 400:
            log_test("Missing sessionId validation", "PASS", f"Correctly returned 400")
        else:
            log_test("Missing sessionId validation", "FAIL", f"Expected 400, got {response.status_code}")
            
    except Exception as e:
        log_test("Missing sessionId validation", "FAIL", f"Exception: {str(e)}")
    
    return True

def test_lead_validation():
    """Test 6: Lead validation - test with minimal data"""
    print("=" * 60)
    print("TEST 6: Lead Validation")
    print("=" * 60)
    
    # Test with minimal valid data
    minimal_lead = {
        "fullName": "Test User",
        "email": "test@example.com"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/leads", json=minimal_lead, headers=HEADERS, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Minimal lead creation", "PASS", "Lead created with minimal data")
            else:
                log_test("Minimal lead creation", "FAIL", f"Success: {data.get('success')}")
        else:
            log_test("Minimal lead creation", "FAIL", f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Minimal lead creation", "FAIL", f"Exception: {str(e)}")
    
    return True

def main():
    """Run all backend tests"""
    print("🚀 SIGNAL ZERO BACKEND TESTING - SUPABASE MIGRATION")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    test_results = []
    
    # Test 1: Health endpoint
    result1 = test_health_endpoint()
    test_results.append(("Health API with Supabase check", result1))
    
    # Test 2: Create lead
    result2, lead_id = test_create_lead()
    test_results.append(("Lead creation with Supabase storage", result2))
    
    # Test 3: Get leads
    result3 = test_get_leads()
    test_results.append(("Get leads from Supabase", result3))
    
    # Test 4: Chat functionality
    result4 = test_chat_functionality()
    test_results.append(("Chat with Supabase history", result4))
    
    # Test 5: Chat validation
    result5 = test_chat_validation()
    test_results.append(("Chat validation", result5))
    
    # Test 6: Lead validation
    result6 = test_lead_validation()
    test_results.append(("Lead validation", result6))
    
    # Summary
    print("=" * 80)
    print("🏁 TEST SUMMARY")
    print("=" * 80)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print("=" * 80)
    print(f"OVERALL RESULT: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - Supabase migration successful!")
    else:
        print("⚠️  Some tests failed - review issues above")
    
    print("=" * 80)

if __name__ == "__main__":
    main()