package dev.dtech.tankBRServer.controller;

import dev.dtech.tankBRServer.model.Rotation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class PositionDTO {
    Double x;
    Double y;

    Rotation rotation;
}
