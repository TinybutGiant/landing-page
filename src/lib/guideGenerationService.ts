/**
 * Guide Generation Service for Landing Page
 * Handles lazy evaluation when approved applications are viewed
 */

export interface GuideGenerationResult {
  success: boolean;
  guideId?: number;
  message: string;
}

export interface UserGuideStatus {
  isGuide: boolean;
  hasApprovedApplication: boolean;
  applicationStatus?: 'drafted' | 'pending' | 'needs_more_info' | 'approved' | 'rejected';
  shouldShowBecomeGuideButton: boolean;
  shouldShowViewApplicationButton: boolean;
  shouldShowRoleSwitch: boolean;
}

/**
 * Check if user has approved application and needs guide generation
 * This function calls the main project's API to trigger lazy evaluation
 */
export async function checkAndGenerateGuideForUser(userId: number): Promise<GuideGenerationResult> {
  try {
    console.log(`[LANDING_PAGE] 🔍 Checking guide generation for user ${userId}`);
    
    // Use relative path - Vite proxy will forward to https://ahhh-yaotu.onrender.com
    const response = await fetch(`/api/v2/guide-generation/check-and-generate/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('yaotu_token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Guide generation check failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`[LANDING_PAGE] Guide generation result:`, result);
    
    return result;
  } catch (error) {
    console.error("Error checking and generating guide for user:", error);
    return {
      success: false,
      message: "Failed to check and generate guide profile"
    };
  }
}

/**
 * Get user guide status for frontend display logic
 */
export async function getUserGuideStatus(userId: number): Promise<UserGuideStatus> {
  try {
    // Use existing endpoint for user guide status
    const response = await fetch(`/api/me/guide-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('yaotu_token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`User guide status check failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`[LANDING_PAGE] User guide status:`, result);
    
    return result;
  } catch (error) {
    console.error("Error getting user guide status:", error);
    // Return safe defaults
    return {
      isGuide: false,
      hasApprovedApplication: false,
      shouldShowBecomeGuideButton: true,
      shouldShowViewApplicationButton: false,
      shouldShowRoleSwitch: false
    };
  }
}

/**
 * Trigger lazy evaluation for approved applications
 * This is called when user views application status and it's approved
 */
export async function triggerLazyEvaluationForApprovedApplication(applicationId: string, userId: number): Promise<GuideGenerationResult> {
  try {
    console.log(`[LANDING_PAGE] 🚀 Triggering lazy evaluation for application ${applicationId}, user ${userId}`);
    
    // Use existing debug endpoint for guide generation
    const response = await fetch(`/api/debug/generate-guide/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('yaotu_token')}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Lazy evaluation trigger failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Lazy evaluation trigger failed: ${response.status} ${response.statusText}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Response is not JSON:', text.substring(0, 200));
      throw new Error('Server returned non-JSON response');
    }

    const result = await response.json();
    console.log(`[LANDING_PAGE] Lazy evaluation result:`, result);
    
    return result;
  } catch (error) {
    console.error("Error triggering lazy evaluation:", error);
    return {
      success: false,
      message: "Failed to trigger lazy evaluation"
    };
  }
}
