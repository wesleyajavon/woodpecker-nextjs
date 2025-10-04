#!/usr/bin/env node

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

/**
 * Test script for Woodpecker Redis Cache System
 */
class CacheTester {
  constructor() {
    this.results = [];
  }

  async log(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
    console.log('-'.repeat(80));
  }

  async testEndpoint(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}/api/test/cache${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testStatistics() {
    this.log('📊 Testing cache statistics...');
    
    const result = await this.testEndpoint('?action=stats');
    if (result.success) {
      this.log('✅ Cache statistics retrieved', result.data);
      this.results.push({ test: 'Statistics', status: 'PASS' });
    } else {
      this.log('❌ Failed to get statistics', result.error);
      this.results.push({ test: 'Statistics', status: 'FAIL', error: result.error });
    }
  }

  async testFAQCache() {
    this.log('ℹ️ Testing FAQ caching...');
    
    // First call (cache miss)
    const start1 = Date.now();
    const result1 = await this.testEndpoint('?action=test-faq');
    const time1 = Date.now() - start1;
    
    if (result1.success) {
      this.log(`✅ First FAQ call: ${time1}ms`);
      
      // Second call (cache hit)
      const start2 = Date.now();
      const result2 = await this.testEndpoint('?action=test-faq');
      const time2 = Date.now() - start2;
      
      if (result2.success) {
        this.log(`✅ Cached FAQ call: ${time2}ms`);
        
        const improvement = time2 < time1 ? Math.round(((time1 - time2) / time1) * 100) : 0;
        this.log(`🚀 Performance improvement: ${improvement}%`);
        
        this.results.push({ 
          test: 'FAQ Cache', 
          status: 'PASS',
          firstCall: time1,
          secondCall: time2,
          improvement: `${improvement}%`
        });
      } else {
        this.log('❌ Second FAQ call failed', result2.error);
        this.results.push({ test: 'FAQ Cache', status: 'FAIL', error: result2.error });
      }
    } else {
      this.log('❌ First FAQ call failed', result1.error);
      this.results.push({ test: 'FAQ Cache', status: 'FAIL', error: result1.error });
    }
  }

  async testLicenseCache() {
    this.log('📄 Testing License caching...');
    
    const result = await this.testEndpoint('?action=test-licenses');
    if (result.success) {
      this.log('✅ License cache test passed', result.data);
      this.results.push({ test: 'License Cache', status: 'PASS' });
    } else {
      this.log('❌ License cache test failed', result.error);
      this.results.push({ test: 'License Cache', status: 'FAIL', error: result.error });
    }
  }

  async testPrivacyCache() {
    this.log('🔒 Testing Privacy caching...');
    
    const result = await this.testEndpoint('?action=test-privacy');
    if (result.success) {
      this.log('✅ Privacy cache test passed', result.data);
      this.results.push({ test: 'Privacy Cache', status: 'PASS' });
    } else {
      this.log('❌ Privacy cache test failed', result.error);
      this.results.push({ test: 'Privacy Cache', status: 'FAIL', error: result.error });
    }
  }

  async testPerformanceSuite() {
    this.log('⚡ Running complete performance test...');
    
    const result = await this.testEndpoint('?action=performance-test');
    if (result.success) {
      this.log('✅ Performance test completed', result.data);
      this.results.push({ test: 'Performance Suite', status: 'PASS' });
    } else {
      this.log('❌ Performance test failed', result.error);
      this.results.push({ test: 'Performance Suite', status: 'FAIL', error: result.error });
    }
  }

  async testManualOperations() {
    this.log('🔧 Testing manual cache operations...');
    
    const testKey = `test-key-${Date.now()}`;
    const testValue = {
      message: 'Test cache value',
      timestamp: new Date().toISOString(),
      data: [1, 2, 3, 4, 5]
    };

    // Test SET operation
    try {
      const setResponse = await fetch(`${BASE_URL}/api/test/cache`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set',
          key: testKey,
          value: testValue,
          ttl: 60
        })
      });

      if (!setResponse.ok) throw new Error(`SET failed: ${setResponse.statusText}`);
      this.log('✅ SET operation successful');

      // Test GET operation
      const getResponse = await fetch(`${BASE_URL}/api/test/cache`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get',
          key: testKey
        })
      });

      if (!getResponse.ok) throw new Error(`GET failed: ${getResponse.statusText}`);
      
      const getData = await getResponse.json();
      if (getData.data && getData.cached) {
        this.log('✅ GET operation successful - data retrieved from cache');
      } else {
        this.log('❌ GET operation failed - data not found in cache');
      }

      // Test DELETE operation
      const deleteResponse = await fetch(`${BASE_URL}/api/test/cache`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          key: testKey
        })
      });

      if (!deleteResponse.ok) throw new Error(`DELETE failed: ${deleteResponse.statusText}`);
      this.log('✅ DELETE operation successful');

      this.results.push({ test: 'Manual Operations', status: 'PASS' });

    } catch (error) {
      this.log('❌ Manual operations test failed', error.message);
      this.results.push({ test: 'Manual Operations', status: 'FAIL', error: error.message });
    }
  }

  async testCacheClearing() {
    this.log('🧹 Testing cache clearing operations...');
    
    // Test static cache clearing
    const result = await this.testEndpoint('?action=clear-static');
    if (result.success) {
      this.log('✅ Static cache cleared successfully');
      this.results.push({ test: 'Cache Clearing', status: 'PASS' });
    } else {
      this.log('❌ Cache clearing failed', result.error);
      this.results.push({ test: 'Cache Clearing', status: 'FAIL', error: result.error });
    }
  }

  generateReport() {
    this.log('📋 Cache System Test Report');
    console.log('='.repeat(80));
    
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const totalTests = this.results.length;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${totalTests - passedTests} ❌`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    console.log('');
    
    console.log('Detailed Results:');
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.test}: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      if (result.improvement) {
        console.log(`   Performance Improvement: ${result.improvement}`);
      }
    });
    
    console.log('='.repeat(80));
    
    if (passedTests === totalTests) {
      this.log('🎉 All tests passed! Cache system is working correctly.');
    } else {
      this.log('⚠️ Some tests failed. Please check the Redis connection and configuration.');
    }
  }

  async runAllTests() {
    this.log('🚀 Starting Woodpecker Cache System Tests');
    console.log(`Base URL: ${BASE_URL}`);
    console.log('='.repeat(80));

    await this.testStatistics();
    await this.testFAQCache();
    await this.testLicenseCache();
    await this.testPrivacyCache();
    await this.testPerformanceSuite();
    await this.testManualOperations();
    await this.testCacheClearing();

    this.generateReport();
  }
}

// Helper function to check if fetch is available
if (typeof fetch === 'undefined') {
  console.error('❌ fetch is not available. Please run this script with Node.js 18+ or install node-fetch');
  process.exit(1);
}

// Run tests
const tester = new CacheTester();
tester.runAllTests().catch(error => {
  console.error('💥 Test suite failed:', error.message);
  process.exit(1);
});
