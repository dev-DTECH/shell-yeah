package dev.dtech.tankBRServer.controller;

import dev.dtech.tankBRServer.dto.MoveDTO;
import dev.dtech.tankBRServer.model.Rotation;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {
    @MessageMapping("/game")
    @SendTo("/topic/public")
    public PositionDTO move(@Payload MoveDTO move) {
        return new PositionDTO(0.0,0.0,new Rotation(0.0,0.0));
    }
}
