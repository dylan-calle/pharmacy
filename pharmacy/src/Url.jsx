export const url = "http://192.168.0.116:8081/api/";
/*DELIMITER //
CREATE DEFINER=`root`@`localhost` TRIGGER `before_insert_type_product` BEFORE INSERT ON `type_product` FOR EACH ROW BEGIN
    DECLARE new_id INT;

    -- Incrementar el contador
    UPDATE id_counter_p SET id = LAST_INSERT_ID(id + 1);
    SET new_id = LAST_INSERT_ID();

    -- Formatear el nuevo ID
    SET NEW.id_product = CONCAT('P-', LPAD(new_id, 4, '0'));
END //*/
