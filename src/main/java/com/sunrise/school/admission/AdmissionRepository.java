package com.sunrise.school.admission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    Optional<Admission> findByApplicationNumberIgnoreCase(String applicationNumber);
}
