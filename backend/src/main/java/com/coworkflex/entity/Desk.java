package com.coworkflex.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "desk")
public class Desk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", nullable = false)
    private Space space;

    @NotBlank
    private String name;

    @Enumerated(EnumType.STRING)
    @NotNull
    private DeskType type;

    @Min(1)
    private Integer capacity;

    @Min(0)
    private Integer pricePerHour;

    private Boolean available;
    private Integer floor;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Space getSpace() { return space; }
    public void setSpace(Space space) { this.space = space; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public DeskType getType() { return type; }
    public void setType(DeskType type) { this.type = type; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Integer getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(Integer pricePerHour) { this.pricePerHour = pricePerHour; }
    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
}
