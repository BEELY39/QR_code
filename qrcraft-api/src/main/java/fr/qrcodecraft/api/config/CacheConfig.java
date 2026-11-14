package fr.qrcodecraft.api.config;

import java.util.List;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

/**
 * Caches en mémoire de l'API, tous déclarés et bornés (FR-008, R1).
 *
 * <p>La liste est fermée : un {@code @Cacheable} sur un nom non déclaré échoue au lieu de
 * créer silencieusement un cache sans limite.
 */
@Configuration(proxyBeanMethods = false)
@EnableCaching
@EnableConfigurationProperties(CacheProperties.class)
public class CacheConfig {

	/** Règles de redirection {@code /r/{shortCode}} → destination. */
	public static final String REDIRECT_RULES = "redirect-rules";

	@Bean
	CaffeineCacheManager cacheManager(CacheProperties properties) {
		CaffeineCacheManager cacheManager = new CaffeineCacheManager();
		cacheManager.setAllowNullValues(false);
		// Liste vide = mode statique : plus aucune création de cache à la volée.
		cacheManager.setCacheNames(List.of());
		properties.specs().forEach((name, spec) -> cacheManager.registerCustomCache(name, Caffeine.from(spec).build()));
		return cacheManager;
	}

}
