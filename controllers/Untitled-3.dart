import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'dart:convert';

class SocketService {
  late IO.Socket socket;

  void initSocket(String token, Function(Map<String, dynamic>) onNewRide) {
    socket = IO.io(
      'https://yourapi.com',
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .enableAutoConnect()
          .setExtraHeaders({'Authorization': 'Bearer $token'})
          .build(),
    );

    socket.connect();

    socket.onConnect((_) {
      print("Connected to socket");
    });

    socket.on('newRideRequest', (data) {
      print("New ride received: $data");
      onNewRide(Map<String, dynamic>.from(data));
    });

    socket.onDisconnect((_) => print("Disconnected from socket"));
  }

  void dispose() {
    socket.dispose();
  }
}
