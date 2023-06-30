package com.example.minitest.controller;

import com.example.minitest.model.City;
import com.example.minitest.service.ICityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class CityController {
    @Autowired
    private ICityService cityService;

    @GetMapping("/api/cities")
    public ResponseEntity<?> getAllPicture() {
        List<City> cities = (List<City>) cityService.findAll();
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }
    @PostMapping("/api/cities")
    public ResponseEntity<?> createNewCity(@RequestBody City city) {
        //Get info of category and set to picture
        return new ResponseEntity<>(cityService.save(city), HttpStatus.CREATED);
    }
    @GetMapping("/api/cities/{id}")
    public ResponseEntity<?> getCityById(@PathVariable Long id) {
        Optional<City> city = cityService.findById(id);
        if (!city.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(city.get(), HttpStatus.OK);
    }
}
