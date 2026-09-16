import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Gato() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const checkWinner = (squares) => {
    const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handlePress = (index) => {
    if (board[index] || checkWinner(board)) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const winner = checkWinner(board);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity key={index} style={styles.cell} onPress={() => handlePress(index)}>
            <Text style={[styles.cellText, { color: cell === 'X' ? '#e74c3c' : '#3498db' }]}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {winner && <Text style={styles.winnerText}>¡Ganador: {winner}!</Text>}
      {!winner && !board.includes(null) && <Text style={styles.winnerText}>¡Empate!</Text>}
      <TouchableOpacity style={styles.resetButton} onPress={() => setBoard(Array(9).fill(null))}>
        <Text style={styles.resetText}>Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#2c3e50' },
  board: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderColor: '#bdc3c7' },
  cell: { width: '33.3%', height: '33.3%', borderWidth: 1, borderColor: '#bdc3c7', justifyContent: 'center', alignItems: 'center' },
  cellText: { fontSize: 40, fontWeight: 'bold' },
  winnerText: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#27ae60' },
  resetButton: { marginTop: 30, backgroundColor: '#34495e', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  resetText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});