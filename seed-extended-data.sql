-- Extended migraine data for 3 and 6 month filtering
-- Insert migraines across the past 180 days with varied patterns

-- Past 180 days (6 months)
INSERT INTO migraines (user_id, start_date, end_date, severity, location, triggers, medications, notes, weather) VALUES
-- 6 months ago (December 2024)
(2, '2024-12-22', '2024-12-22 05:30:00', 2, 'Right temple', ARRAY['Holiday Stress', 'Sugar Overload'], ARRAY['Ibuprofen'], 'Holiday party migraine', 'Cold'),
(2, '2024-12-18', '2024-12-18 08:45:00', 3, 'Entire head', ARRAY['Travel', 'Dehydration', 'Altitude'], ARRAY['Sumatriptan'], 'Flight migraine severe', 'Clear'),
(2, '2024-12-10', '2024-12-10 04:20:00', 1, 'Left side', ARRAY['Weather Change', 'Barometric Pressure'], ARRAY['Acetaminophen'], 'Weather front migraine', 'Stormy'),
(2, '2024-12-05', '2024-12-05 06:15:00', 2, 'Temples', ARRAY['Work Stress', 'Screen Time'], ARRAY['Ibuprofen'], 'End of year deadline stress', 'Overcast'),

-- 5 months ago (January 2025) 
(2, '2025-01-28', '2025-01-28 07:30:00', 3, 'Right side', ARRAY['Chocolate', 'Hormonal'], ARRAY['Sumatriptan', 'Anti-nausea'], 'Severe hormonal migraine', 'Rainy'),
(2, '2025-01-22', '2025-01-22 03:45:00', 2, 'Left temple', ARRAY['Lack of Sleep', 'Caffeine Withdrawal'], ARRAY['Ibuprofen'], 'Sleep disruption migraine', 'Clear'),
(2, '2025-01-18', '2025-01-18 09:20:00', 1, 'Forehead', ARRAY['Bright Lights', 'Eye Strain'], ARRAY['Acetaminophen'], 'Light sensitivity migraine', 'Sunny'),
(2, '2025-01-14', '2025-01-14 05:10:00', 3, 'Entire head', ARRAY['Red Wine', 'Late Night'], ARRAY['Sumatriptan'], 'Wine triggered severe migraine', 'Cold'),
(2, '2025-01-09', '2025-01-09 06:00:00', 2, 'Right temple', ARRAY['Processed Cheese', 'MSG'], ARRAY['Ibuprofen'], 'Food additive reaction', 'Overcast'),
(2, '2025-01-03', '2025-01-03 04:30:00', 1, 'Left side', ARRAY['New Year Stress', 'Alcohol'], ARRAY['Acetaminophen'], 'New year recovery migraine', 'Clear'),

-- 4 months ago (February 2025)
(2, '2025-02-26', '2025-02-26 08:15:00', 2, 'Temples', ARRAY['Citrus Fruits', 'Histamine'], ARRAY['Ibuprofen'], 'Citrus reaction migraine', 'Rainy'),
(2, '2025-02-20', '2025-02-20 05:45:00', 3, 'Right side', ARRAY['Dark Chocolate', 'Tyramine'], ARRAY['Sumatriptan'], 'Chocolate triggered severe', 'Stormy'),
(2, '2025-02-15', '2025-02-15 07:00:00', 1, 'Left temple', ARRAY['Weather Change'], ARRAY['Acetaminophen'], 'Weather front mild', 'Cold'),
(2, '2025-02-10', '2025-02-10 06:30:00', 2, 'Forehead', ARRAY['Work Deadline', 'High Stress'], ARRAY['Ibuprofen'], 'Project deadline stress', 'Clear'),
(2, '2025-02-05', '2025-02-05 04:15:00', 3, 'Entire head', ARRAY['Aged Cheese', 'Histamine'], ARRAY['Sumatriptan', 'Anti-nausea'], 'Cheese triggered severe', 'Overcast'),

-- 3 months ago (March 2025)
(2, '2025-03-28', '2025-03-28 09:00:00', 2, 'Right temple', ARRAY['Spring Allergies', 'Pollen'], ARRAY['Ibuprofen'], 'Allergy season migraine', 'Sunny'),
(2, '2025-03-22', '2025-03-22 06:45:00', 1, 'Left side', ARRAY['Daylight Saving', 'Sleep Disruption'], ARRAY['Acetaminophen'], 'Time change adjustment', 'Clear'),
(2, '2025-03-18', '2025-03-18 05:20:00', 3, 'Temples', ARRAY['Red Wine', 'Social Event'], ARRAY['Sumatriptan'], 'Social gathering trigger', 'Rainy'),
(2, '2025-03-12', '2025-03-12 07:30:00', 2, 'Right side', ARRAY['Skipped Meal', 'Low Blood Sugar'], ARRAY['Ibuprofen'], 'Fasting migraine', 'Overcast'),
(2, '2025-03-08', '2025-03-08 04:50:00', 1, 'Forehead', ARRAY['Screen Time', 'Blue Light'], ARRAY['Acetaminophen'], 'Digital eye strain', 'Cold'),
(2, '2025-03-03', '2025-03-03 08:10:00', 3, 'Entire head', ARRAY['Processed Meat', 'Nitrates'], ARRAY['Sumatriptan'], 'Nitrate sensitivity severe', 'Stormy'),

-- 2 months ago (April 2025)
(2, '2025-04-29', '2025-04-29 06:20:00', 2, 'Left temple', ARRAY['Weather Change', 'Humidity'], ARRAY['Ibuprofen'], 'Spring weather pattern', 'Rainy'),
(2, '2025-04-24', '2025-04-24 05:35:00', 1, 'Right side', ARRAY['Mild Stress', 'Work Meeting'], ARRAY['Acetaminophen'], 'Pre-meeting anxiety', 'Clear'),
(2, '2025-04-19', '2025-04-19 07:45:00', 3, 'Temples', ARRAY['Dark Chocolate', 'Caffeine'], ARRAY['Sumatriptan'], 'Double trigger severe', 'Sunny'),
(2, '2025-04-14', '2025-04-14 04:25:00', 2, 'Forehead', ARRAY['Artificial Sweeteners'], ARRAY['Ibuprofen'], 'Aspartame reaction', 'Overcast'),
(2, '2025-04-09', '2025-04-09 08:00:00', 1, 'Left side', ARRAY['Lack of Sleep'], ARRAY['Acetaminophen'], 'Sleep deficit mild', 'Cold'),
(2, '2025-04-04', '2025-04-04 06:15:00', 3, 'Entire head', ARRAY['Aged Wine', 'Sulfites'], ARRAY['Sumatriptan', 'Anti-nausea'], 'Wine sulfite reaction', 'Stormy'),

-- 1 month ago (May 2025)
(2, '2025-05-30', '2025-05-30 07:20:00', 2, 'Right temple', ARRAY['High Pollen', 'Allergies'], ARRAY['Ibuprofen'], 'Peak allergy season', 'Sunny'),
(2, '2025-05-25', '2025-05-25 05:50:00', 1, 'Left temple', ARRAY['Travel Fatigue'], ARRAY['Acetaminophen'], 'Trip recovery mild', 'Clear'),
(2, '2025-05-20', '2025-05-20 08:30:00', 3, 'Temples', ARRAY['Citrus Fruits', 'High Vitamin C'], ARRAY['Sumatriptan'], 'Citrus overload severe', 'Rainy'),
(2, '2025-05-15', '2025-05-15 06:40:00', 2, 'Right side', ARRAY['Work Stress', 'Deadline'], ARRAY['Ibuprofen'], 'Project pressure migraine', 'Overcast'),
(2, '2025-05-10', '2025-05-10 04:55:00', 1, 'Forehead', ARRAY['Eye Strain', 'Computer Work'], ARRAY['Acetaminophen'], 'Digital fatigue mild', 'Cold'),
(2, '2025-05-05', '2025-05-05 07:05:00', 3, 'Entire head', ARRAY['Processed Cheese', 'Tyramine'], ARRAY['Sumatriptan'], 'Cheese tyramine severe', 'Stormy');

-- Daily logs for extended periods
INSERT INTO daily_logs (user_id, date, mood_score, stress_level, sleep_hours, weather, notes) VALUES
-- December 2024 logs
('2', '2024-12-22', 3, 8, 420, 'Cold', 'Holiday stress high'),
('2', '2024-12-18', 2, 9, 300, 'Clear', 'Travel day exhausting'),
('2', '2024-12-10', 4, 6, 480, 'Stormy', 'Weather affecting mood'),
('2', '2024-12-05', 3, 7, 420, 'Overcast', 'Work pressure building'),

-- January 2025 logs  
('2', '2025-01-28', 2, 8, 360, 'Rainy', 'Hormonal fluctuations'),
('2', '2025-01-22', 3, 7, 300, 'Clear', 'Sleep disrupted by noise'),
('2', '2025-01-18', 4, 5, 480, 'Sunny', 'Bright day painful'),
('2', '2025-01-14', 2, 9, 420, 'Cold', 'Wine reaction severe'),
('2', '2025-01-09', 3, 6, 450, 'Overcast', 'Food reaction noted'),
('2', '2025-01-03', 4, 8, 360, 'Clear', 'New year recovery'),

-- February 2025 logs
('2', '2025-02-26', 3, 7, 420, 'Rainy', 'Citrus sensitivity confirmed'),
('2', '2025-02-20', 2, 9, 390, 'Stormy', 'Chocolate trigger strong'),
('2', '2025-02-15', 4, 5, 480, 'Cold', 'Weather change mild'),
('2', '2025-02-10', 3, 8, 420, 'Clear', 'Deadline stress peak'),
('2', '2025-02-05', 2, 9, 360, 'Overcast', 'Cheese reaction severe'),

-- March 2025 logs
('2', '2025-03-28', 3, 6, 450, 'Sunny', 'Spring allergies starting'),
('2', '2025-03-22', 4, 5, 480, 'Clear', 'Time change adjustment'),
('2', '2025-03-18', 2, 8, 420, 'Rainy', 'Social event stress'),
('2', '2025-03-12', 3, 7, 390, 'Overcast', 'Meal timing important'),
('2', '2025-03-08', 4, 4, 450, 'Cold', 'Screen time managed'),
('2', '2025-03-03', 2, 9, 360, 'Stormy', 'Processed food reaction'),

-- April 2025 logs
('2', '2025-04-29', 3, 6, 420, 'Rainy', 'Weather patterns noted'),
('2', '2025-04-24', 4, 5, 480, 'Clear', 'Meeting went well'),
('2', '2025-04-19', 2, 8, 390, 'Sunny', 'Double trigger day'),
('2', '2025-04-14', 3, 6, 450, 'Overcast', 'Sweetener avoided now'),
('2', '2025-04-09', 4, 4, 360, 'Cold', 'Sleep deficit noted'),
('2', '2025-04-04', 2, 9, 420, 'Stormy', 'Wine sulfites confirmed'),

-- May 2025 logs
('2', '2025-05-30', 3, 7, 450, 'Sunny', 'Allergy season peak'),
('2', '2025-05-25', 4, 4, 480, 'Clear', 'Travel recovery good'),
('2', '2025-05-20', 2, 8, 420, 'Rainy', 'Citrus limit reached'),
('2', '2025-05-15', 3, 7, 390, 'Overcast', 'Work pressure managed'),
('2', '2025-05-10', 4, 3, 450, 'Cold', 'Computer breaks help'),
('2', '2025-05-05', 2, 9, 360, 'Stormy', 'Cheese confirmed trigger');