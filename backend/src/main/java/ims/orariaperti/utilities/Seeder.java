package ims.orariaperti.utilities;

import ims.orariaperti.entity.Reservation;
import ims.orariaperti.entity.Room;
import ims.orariaperti.repository.ReservationRepository;
import ims.orariaperti.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.UUID;

@Component
public class Seeder implements CommandLineRunner {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public Seeder(ReservationRepository reservationRepository,  RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public void run(String... args) {
        if (roomRepository.count() == 0) {
            Room room101 = roomRepository.save(new Room(null, "101", new ArrayList<>(Arrays.asList(RoomFeatures.BEAMER, RoomFeatures.WHITEBOARD))));
            Room room102 = roomRepository.save(new Room(null, "102", new ArrayList<>(Arrays.asList(RoomFeatures.BEAMER, RoomFeatures.WHITEBOARD))));
            @SuppressWarnings("unused")
            Room room201 = roomRepository.save(new Room(null, "201", new ArrayList<>(Arrays.asList(RoomFeatures.BEAMER, RoomFeatures.WATER_SOURCE))));
            @SuppressWarnings("unused")
            Room room201_2 = roomRepository.save(new Room(null, "201", new ArrayList<>(Arrays.asList(RoomFeatures.BEAMER, RoomFeatures.WATER_SOURCE))));
            @SuppressWarnings("unused")
            Room room202 = roomRepository.save(new Room(null, "202", new ArrayList<>(Arrays.asList(RoomFeatures.BEAMER, RoomFeatures.WHITEBOARD, RoomFeatures.AIR_CONDITIONING))));
            @SuppressWarnings("unused")
            Room room340 = roomRepository.save(new Room(null, "340", new ArrayList<>(Arrays.asList(RoomFeatures.BEAMER, RoomFeatures.WHITEBOARD, RoomFeatures.AIR_CONDITIONING, RoomFeatures.POWER_OUTLETS))));
            System.out.println("Sample Rooms have been added to the database.");

            if (reservationRepository.count() == 0) {
                reservationRepository.save(new Reservation(
                        null,
                        LocalDate.now(),
                        LocalTime.of(9, 0),
                        LocalTime.of(10, 0),
                        room101,
                        "Team Meeting",
                        "Tom, Johnson",
                        UUID.randomUUID(),
                        UUID.randomUUID()
                ));
                reservationRepository.save(new Reservation(
                        null,
                        LocalDate.now(),
                        LocalTime.of(11, 0),
                        LocalTime.of(12, 0),
                        room102,
                        "Project Discussion",
                        "Mac, Fluury",
                        UUID.randomUUID(),
                        UUID.randomUUID()
                ));
                reservationRepository.save(new Reservation(
                        null,
                        LocalDate.now(),
                        LocalTime.of(11, 0),
                        LocalTime.of(12, 0),
                        room102,
                        "Project Feedback",
                        "Pluh, Tompson",
                        UUID.randomUUID(),
                        UUID.randomUUID()
                ));
                System.out.println("Sample Reservations have been added to the database.");
            }
        }
    }
}
