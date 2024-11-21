import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function App() {
  const initialTasks = [
    {
      id: '1',
      system: 'Internet Services',
      services: [
        { name: 'Services: External', state: 'click here to set', comment: '' },
        { name: 'Services: Internal', state: 'click here to set state', comment: '' },
      ],
    },
      { id: '2', item: '2', system: 'Mufulira-Nkana Liquid Fibre Link', services: [{ name: 'Services: Connectivity', state: 'click here to set state', comment: '' }, { name: 'Services: Ping Response Range', state: 'click to set state', comment: '' }] },
    { id: '3', item: '3', system: 'Mufulira-Nkana MTN Fibre Back Up Link', services: [{ name: 'Services: Connectivity', state: 'click here to set state', comment: '' }, { name: 'Services: Ping Response Range', state: 'click here to set state', comment: '' }] },
    { id: '4', item: '4', system: 'IT Board Room Codec', services: [{ name: 'Services: Connectivity & Testing', state: 'click here to set state', comment: '' }] },
    { id: '5', item: '5', system: 'Trust School', services: [{ name: 'Service: Connectivity', state: 'click here to set state', comment: '' }] },
    { id: '6', item: '6', system: 'VPN Connectivity', services: [{ name: 'Services: Connection Establishment', state: 'click here to set state', comment: '' }, { name: 'Services: LAN Accessibility', state: 'click here to set state', comment: '' }] },
    { id: '7', item: '7', system: 'B2B VPN', services: [{ name: 'Services: Connection Establishment', state: 'click here to set state', comment: '' }, { name: 'LAN Accessibility', state: 'click here to state', comment: '' }] },
    { id: '8', item: '8', system: 'Wireless Access Points Connectivity', services: [{ name: 'Services: Internal WLAN', state: 'click here to set state', comment: '' }, { name: 'Services: External Wireless', state: 'click here to set state', comment: '' }] },
    { id: '9', item: '9', system: 'Network SNMP Topology Monitoring', services: [{ name: 'Services: Wired LAN', state: 'click here to set state', comment: '' }, { name: 'Services: Wireless Radios LAN', state: 'click to set state', comment: '' }] },
    { id: '10', item: '10', system: 'Executives Residential Link', services: [{ name: 'Services: Internal', state: 'click here to set state', comment: '' }, {name: 'External', state: 'click here to set state'}] },
    { id: '11', item: '11', system: 'Multi Factor Authentication (MFA)', services: [{ name: 'Services: Connectivity', state: 'click here to set state', comment: '' }, {name: 'Services: Internal', state: 'click here to set state'}] },
    { id: '12', item: '12', system: 'Workspace/Mobile Phone e-mail', services: [{ name: 'Services: Send/Receive', state: 'click here to set state', comment: '' }] },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [adminData, setAdminData] = useState([
    { id: '1', name: '', position: 'Network Administrator/ Network Support Officer', signature: '', date: '' },
    { id: '2', name: '', position: 'Manager-IT/ Network Administrator', signature: '', date: '' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    setAdminData((prev) =>
      prev.map((row) => ({ ...row, date: new Date().toLocaleDateString() }))
    );
  }, []);

  const handleInputChange = (text, rowId, field) => {
    setAdminData((prevData) =>
      prevData.map((row) => (row.id === rowId ? { ...row, [field]: text } : row))
    );
  };

  const toggleState = (taskId, serviceName) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              services: task.services.map((service) =>
                service.name === serviceName
                  ? {
                      ...service,
                      state: service.state === 'OK' ? 'Not OK' : 'OK',
                      comment:
                        service.state === 'OK'
                          ? 'Do not continue with processing'
                          : 'Continue processing',
                    }
                  : service
              ),
            }
          : task
      )
    );
  };

  const handleCommentChange = (taskId, serviceName, text) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              services: task.services.map((service) =>
                service.name === serviceName
                  ? { ...service, comment: text }
                  : service
              ),
            }
          : task
      )
    );
  };

  const submitData = async () => {
    const payload = { tasks, adminData };
    setIsSubmitting(true);

    try {
      const response = await fetch('API_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setIsSubmitting(false);

      if (response.ok) {
        Alert.alert('Success', 'Data submitted successfully!');
      } else {
        const errorText = await response.text();
        Alert.alert('Error', `Failed to submit data: ${errorText}`);
      }
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', `Network error: ${error.message}`);
    }
  };

  const renderTaskForm = (task) => (
    <View key={task.id} style={styles.formContainer}>
      <Text style={styles.formTitle}>{task.system}</Text>
      {task.services.map((service) => (
        <View key={service.name} style={styles.serviceRow}>
          <Text style={styles.label}>{service.name}</Text>
          <TouchableOpacity
            onPress={() => toggleState(task.id, service.name)}
            style={styles.stateButton}
          >
            <Text style={styles.stateText}>State: {service.state}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.inputCell}
            value={service.comment}
            onChangeText={(text) => handleCommentChange(task.id, service.name, text)}
            placeholder="Add comments here"
          />
        </View>
      ))}
    </View>
  );

  const renderAdminData = () => (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Position</Text>
        <Text style={styles.headerCell}>Signature</Text>
        <Text style={styles.headerCell}>Date</Text>
      </View>
      {adminData.map((row) => (
        <View key={row.id} style={styles.row}>
          <TextInput
            style={styles.inputCell}
            value={row.name}
            onChangeText={(text) => handleInputChange(text, row.id, 'name')}
            placeholder="Name"
          />
          <TextInput
            style={styles.inputCell}
            value={row.position}
            onChangeText={(text) => handleInputChange(text, row.id, 'position')}
          />
          <TextInput
            style={styles.inputCell}
            value={row.signature}
            onChangeText={(text) => handleInputChange(text, row.id, 'signature')}
            placeholder="Signature"
          />
          <TextInput
            style={styles.inputCell}
            value={row.date}
            onChangeText={(text) => handleInputChange(text, row.id, 'date')}
            placeholder="Date"
          />
        </View>
      ))}
    </View>
  );

  const filteredTasks = tasks.filter((task) =>
    task.system.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={styles.image} />
      </View>
      <Text style={styles.title}>
        {'MOPANI COPPER MINES\nINFORMATION TECHNOLOGY\n FM-IT-046C\nNKANA DAILY NETWORK SYSTEM FORM'}
      </Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {filteredTasks.map(renderTaskForm)}
      <View style={styles.instructions}>
        <Text>For Items 2 And 3, ping responses above 10ms should call for investigations.</Text>
      </View>

      {isSubmitting ? (
        <ActivityIndicator size="large" color="green" style={{ marginVertical: 20 }} />
      ) : (
        <TouchableOpacity onPress={submitData} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}

      {renderAdminData()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: 150,
    height: 160,
    position: 'absolute',
    top: 1,
    left: 10,
    zIndex: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#000',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 5,
  },
  table: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  inputCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 14,
    textAlign: 'left',
    borderRadius: 5,
    marginBottom: 10,
  },
   serviceRow: {
    marginBottom: 15,
  },
  formContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    border : 1,
    borderColor: '#ddd',
    fontSize: 14,
    textColor: '#ddd',
  },
   submitButton: {
    backgroundColor: 'green',
    padding: 15,
    width: '50%',           
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',    
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formTitle: {
    fontAlign: 'left',
    borderRadius:18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stateButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginBottom: 10,
    marginTop: 5,
  },
  stateText: {
    color: '#fff',
    fontSize: 14,
  },
  label: {
     fontSize: 14,
     
  }
});
