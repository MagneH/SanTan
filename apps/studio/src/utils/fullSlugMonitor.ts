/**
 * Monitoring and analytics for fullSlug operations
 * Helps track performance and identify issues in production
 */

interface FullSlugMetrics {
  computations: {
    total: number;
    successful: number;
    failed: number;
    averageTimeMs: number;
  };
  batchUpdates: {
    total: number;
    successful: number;
    failed: number;
    documentsUpdated: number;
  };
  cacheHits: number;
  cacheMisses: number;
}

class FullSlugMonitor {
  private metrics: FullSlugMetrics = {
    computations: { total: 0, successful: 0, failed: 0, averageTimeMs: 0 },
    batchUpdates: { total: 0, successful: 0, failed: 0, documentsUpdated: 0 },
    cacheHits: 0,
    cacheMisses: 0,
  };

  private computationTimes: number[] = [];
  private isEnabled = process.env.NODE_ENV === 'development';

  /**
   * Track a computation operation
   */
  trackComputation<T>(operation: () => Promise<T>, useCache = false): Promise<T> {
    if (!this.isEnabled) return operation();

    const startTime = Date.now();
    this.metrics.computations.total++;

    if (useCache) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }

    return operation()
      .then((result) => {
        this.metrics.computations.successful++;
        this.recordComputationTime(Date.now() - startTime);
        return result;
      })
      .catch((error) => {
        this.metrics.computations.failed++;
        this.recordComputationTime(Date.now() - startTime);
        console.error('FullSlug computation failed:', error);
        throw error;
      });
  }

  /**
   * Track a batch update operation
   */
  trackBatchUpdate(documentCount: number, operation: () => Promise<void>): Promise<void> {
    if (!this.isEnabled) return operation();

    this.metrics.batchUpdates.total++;

    return operation()
      .then(() => {
        this.metrics.batchUpdates.successful++;
        this.metrics.batchUpdates.documentsUpdated += documentCount;
      })
      .catch((error) => {
        this.metrics.batchUpdates.failed++;
        console.error(`Batch update failed for ${documentCount} documents:`, error);
        throw error;
      });
  }

  private recordComputationTime(timeMs: number): void {
    this.computationTimes.push(timeMs);

    // Keep only last 100 measurements for average calculation
    if (this.computationTimes.length > 100) {
      this.computationTimes.shift();
    }

    this.metrics.computations.averageTimeMs =
      this.computationTimes.reduce((sum, time) => sum + time, 0) / this.computationTimes.length;
  }

  /**
   * Get current metrics
   */
  getMetrics(): FullSlugMetrics {
    return { ...this.metrics };
  }

  /**
   * Log performance report to console
   */
  logReport(): void {
    if (!this.isEnabled) return;

    const metrics = this.getMetrics();
    const cacheHitRate = (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100;

    console.group('🔍 FullSlug Performance Report');
    console.log(`📊 Computations: ${metrics.computations.successful}/${metrics.computations.total} successful`);
    console.log(`⚡ Average computation time: ${metrics.computations.averageTimeMs.toFixed(1)}ms`);
    console.log(`🎯 Cache hit rate: ${cacheHitRate.toFixed(1)}%`);
    console.log(`📦 Batch updates: ${metrics.batchUpdates.successful}/${metrics.batchUpdates.total} successful`);
    console.log(`📝 Documents updated: ${metrics.batchUpdates.documentsUpdated}`);

    if (metrics.computations.failed > 0) {
      console.warn(`⚠️ Failed computations: ${metrics.computations.failed}`);
    }

    if (metrics.batchUpdates.failed > 0) {
      console.warn(`⚠️ Failed batch updates: ${metrics.batchUpdates.failed}`);
    }

    console.groupEnd();
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics = {
      computations: { total: 0, successful: 0, failed: 0, averageTimeMs: 0 },
      batchUpdates: { total: 0, successful: 0, failed: 0, documentsUpdated: 0 },
      cacheHits: 0,
      cacheMisses: 0,
    };
    this.computationTimes = [];
  }
}

// Singleton instance
export const fullSlugMonitor = new FullSlugMonitor();

// Auto-log report every 5 minutes in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setInterval(() => fullSlugMonitor.logReport(), 5 * 60 * 1000);
}
