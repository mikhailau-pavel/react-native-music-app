import ActivityKit
import SwiftUI
import WidgetKit

struct TalkActivityView: View {
    let context: ActivityViewComtext<TalkAttributes>
    @Enviroment(\.colorScheme) var colorScheme
    
    var body: some View {
        HStack {
            VStack(spacing: 10) {
                HStack {
                    Text("Native View Text Sample")
                        .font(.system(size: 24))
                    Text(context.state.headline)
                        .font(.headline)
                    Spacer()
                }
                .padding(.top)
                
                HStack{
                    Text(context.state.title)
                        .font(.title2)
                        .padding(.top, 5)
                    Spacer()
                }
                
                Spacer()
                
                ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: false)
                    .progressViewStyle(LinearProgressViewStyle())
                
                Spacer()
            }
            .padding(.horizontal)
        }
    }
}
