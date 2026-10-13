package it.arenahub.backend.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RuoloConverter implements AttributeConverter<Ruolo, String> {

	@Override
	public String convertToDatabaseColumn(Ruolo ruolo) {
		return ruolo == null ? null : ruolo.name().toLowerCase();
	}

	@Override
	public Ruolo convertToEntityAttribute(String valore) {
		return valore == null ? null : Ruolo.valueOf(valore.toUpperCase());
	}
}
