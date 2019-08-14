import { StyleSheet, Dimensions } from "react-native"

export const styles = StyleSheet.create({

  loading: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center"
  },

  uploadImageLoading: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center"
  },

  uploadImageIcon: {
    width: 40,
    height: 40,
    top: -53,
    bottom: 0,
    left: Dimensions.get("screen").width - 87,
    backgroundColor: "#e6e6e6",
    borderRadius: 25,
    padding: 5,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 }
  },

  emailVerifiactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20
  }
})