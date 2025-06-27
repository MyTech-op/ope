class DriverHomeScreen extends StatefulWidget {
  @override
  State<DriverHomeScreen> createState() => _DriverHomeScreenState();
}

class _DriverHomeScreenState extends State<DriverHomeScreen> {
  final SocketService socketService = SocketService();
  final List<Map<String, dynamic>> rides = [];

  @override
  void initState() {
    super.initState();
    socketService.initSocket(
      "your_access_token_here",
      (ride) {
        setState(() {
          rides.add(ride);
        });
      },
    );
  }

  @override
  void dispose() {
    socketService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Available Rides")),
      body: ListView.builder(
        itemCount: rides.length,
        itemBuilder: (context, index) {
          final ride = rides[index];
          return ListTile(
            title: Text("Pickup: ${ride['pickup']['address']}"),
            subtitle: Text("Drop: ${ride['drop']['address']}"),
            trailing: Text("Fare: ${ride['fare']}"),
          );
        },
      ),
    );
  }
}
