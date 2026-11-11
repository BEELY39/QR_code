package fr.qrcodecraft.api.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.caffeine.CaffeineCache;

/**
 * US2 — cache borné en taille et en durée, réglable cache par cache (FR-008, SC-003).
 */
class CacheConfigTests {

	private final ApplicationContextRunner runner = new ApplicationContextRunner()
		.withUserConfiguration(CacheConfig.class)
		.withBean(CountingLoader.class);

	@Test
	void secondReadOfSameKeyIsServedFromMemory() {
		runner.withPropertyValues("qrcraft.cache.specs.redirect-rules=maximumSize=100,expireAfterWrite=5m")
			.run(context -> {
				CountingLoader loader = context.getBean(CountingLoader.class);
				loader.load("abc");
				loader.load("abc");
				assertThat(loader.calls()).isEqualTo(1);
			});
	}

	@Test
	void cacheSizeStaysBounded() {
		runner.withPropertyValues("qrcraft.cache.specs.redirect-rules=maximumSize=2,expireAfterWrite=1m")
			.run(context -> {
				CountingLoader loader = context.getBean(CountingLoader.class);
				loader.load("a");
				loader.load("b");
				loader.load("c");
				var nativeCache = redirectRules(context.getBean(CacheManager.class)).getNativeCache();
				nativeCache.cleanUp();
				assertThat(nativeCache.estimatedSize()).isLessThanOrEqualTo(2);
			});
	}

	@Test
	void cacheExpiresAfterWrite() {
		runner.withPropertyValues("qrcraft.cache.specs.redirect-rules=maximumSize=10,expireAfterWrite=1m")
			.run(context -> {
				var policy = redirectRules(context.getBean(CacheManager.class)).getNativeCache().policy();
				assertThat(policy.expireAfterWrite()).isPresent();
				assertThat(policy.expireAfterWrite().get().getExpiresAfter()).isEqualTo(Duration.ofMinutes(1));
			});
	}

	@Test
	void undeclaredCacheIsNotCreatedOnTheFly() {
		runner.withPropertyValues("qrcraft.cache.specs.redirect-rules=maximumSize=10,expireAfterWrite=1m")
			.run(context -> assertThat(context.getBean(CacheManager.class).getCache("faute-de-frappe")).isNull());
	}

	@Test
	void specWithoutSizeLimitIsRejectedAtStartup() {
		runner.withPropertyValues("qrcraft.cache.specs.redirect-rules=expireAfterWrite=5m")
			.run(context -> assertThat(context).hasFailed());
	}

	@Test
	void specWithoutExpirationIsRejectedAtStartup() {
		runner.withPropertyValues("qrcraft.cache.specs.redirect-rules=maximumSize=10")
			.run(context -> assertThat(context).hasFailed());
	}

	@Test
	void missingCacheDeclarationIsRejectedAtStartup() {
		runner.run(context -> assertThat(context).hasFailed());
	}

	private static CaffeineCache redirectRules(CacheManager cacheManager) {
		return (CaffeineCache) cacheManager.getCache(CacheConfig.REDIRECT_RULES);
	}

	static class CountingLoader {

		private final AtomicInteger calls = new AtomicInteger();

		@Cacheable(CacheConfig.REDIRECT_RULES)
		public String load(String shortCode) {
			calls.incrementAndGet();
			return "https://example.com/" + shortCode;
		}

		// Accès par méthode : le bean est un proxy, ses champs ne sont pas ceux de la cible.
		public int calls() {
			return calls.get();
		}

	}

}
