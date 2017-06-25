Mgr-App2
===========

[powrót](https://github.com/krzysiekdz/mgr-main)


Aplikację nalezy uruchomić, gdy [app1](https://github.com/krzysiekdz/mgr-app1) skończy działanie. App2:
- wczytuje wszystkie logi z folderu traces
- przetwarza je (filtrowanie, konwersja do przystępniejszej postaci) 
- oblicza średnie czasy trwania poszczegolnych operacji
- podsumowuje te czasy
- porównuje wyniki z czasami trwania operacji w czystym javascript. 
- ostateczne dane zapisuje do pliku "app3/results.json" (app3 odpowiada za prezentację tych danych)

Konfiguracja:<br>
- Plik "cfg.js":
	- REJECT_COUNT - liczba próbek testowych do odrzucenia (najgorsze wyniki "wyrzucamy") 
	- LEFT_COUNT - liczba próbek testowych do pobrania (alternatywny sposob uśrednienia wyników - zebranie iluś "najlepszych")

Uruchamianie: <br>
Program uruchamiać będąc w katalogu nadrzędnym poleceniem: <br>
node app2/trace-processor.js 
