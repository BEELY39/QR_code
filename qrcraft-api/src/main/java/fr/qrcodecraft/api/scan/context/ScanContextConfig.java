package fr.qrcodecraft.api.scan.context;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/** Active les propriétés de géolocalisation ({@code qrcraft.geoip.*}). */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(GeoIpProperties.class)
public class ScanContextConfig {
}
