package com.coworkflex.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.List;

@Entity
@Table(name = "space")
public class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String city;

    @NotBlank
    private String address;

    private Double rating;
    private Integer reviewCount;

    @Min(1)
    private Integer capacity;

    @Min(0)
    private Integer available;

    private String amenities;
    private String imageId;
    private Integer priceFrom;

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Desk> desks;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Integer getAvailable() { return available; }
    public void setAvailable(Integer available) { this.available = available; }
    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }
    public String getImageId() { return imageId; }
    public void setImageId(String imageId) { this.imageId = imageId; }
    public Integer getPriceFrom() { return priceFrom; }
    public void setPriceFrom(Integer priceFrom) { this.priceFrom = priceFrom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<Desk> getDesks() { return desks; }
    public void setDesks(List<Desk> desks) { this.desks = desks; }
}
